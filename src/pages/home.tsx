import { useRef, useCallback, useEffect, useState } from "react";
import ProfileMenu from "../components/ProfileMenu";
import SearchBar from "../components/SearchBar";
import anonymousIcon from "../assets/anonymous.png";
import MainMenu from "../components/MainMenu";
import AudioControl from "../components/AudioControl";
import { useWebSocket } from "../hooks/UseWebsocket";
import ContentFrame from "../components/ContentFrame";

const WS_URL = "ws://localhost:8080/";
const base64ToUrl = (base64Data: string, contentType = "image/png") => {
  try {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteArrays);
    const blob = new Blob([byteArray], { type: contentType });
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error("Failed to convert base64 to Blob", e);
    return "";
  }
};

function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const queueRef = useRef<ArrayBuffer[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const seekTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const isWaitingForChunk = useRef(false);
  const [serverState, setServerState] = useState({
    playing: false,
    position: 0,
  });
  const [currentSongLen, setCurrentSongLen] = useState(180);

  // websocket handling
  const handleAudioChunk = useCallback((chunk: ArrayBuffer) => {
    const sb = sourceBufferRef.current;
    isWaitingForChunk.current = false;
    const audio = audioRef.current;

    if (sb && !sb.updating && queueRef.current.length === 0) {
      try {
        sb.appendBuffer(chunk);
        
        if (audio && audio.paused && serverState.playing && audio.readyState >= 2) {
            audio.play().catch(console.error);
        }
      } catch (e) {
        console.error("Error appending buffer:", e);
      }
    } else {
      queueRef.current.push(chunk);
    }
  }, [serverState.playing]);

  const handleMessage = useCallback((msg: any) => {
    if (msg.type === "song_start") {
      audioRef.current?.play().catch(console.error);
      setCurrentSongLen(Number(msg.song_len));
      isWaitingForChunk.current = false;
      queueRef.current = [];
      setIsDragging(false);

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
      send(JSON.stringify({ inst: "need_chunk" }));
      setTimeout(() => send(JSON.stringify({ inst: "need_chunk" })), 150);
      setTimeout(() => send(JSON.stringify({ inst: "need_chunk" })), 300);
    } else if (msg.type === "song_info") {
      const imageUrl = base64ToUrl(msg.info.thumbnail);

      const newSong = {
        ...msg.info,
        displayImage: imageUrl,
      };

      setSongs((prev) => [...prev, newSong]);
    } else if (msg.type === "state") {
      setServerState((prev) => ({
        playing: msg.playing,
        position: isDragging ? prev.position : Math.floor(Number(msg.position)),
      }));
    } else if (msg.type === "top_searches") {
      const list = msg.searches ? msg.searches.split(",") : [];
      setSuggestions(list);
    }
  }, []);

  const { status, send } = useWebSocket({
    url: WS_URL,
    onAudioChunk: handleAudioChunk,
    onMessage: handleMessage,
  });

  // audio buffering
  useEffect(() => {
    const ms = new MediaSource();
    mediaSourceRef.current = ms;

    if (audioRef.current) {
      audioRef.current.src = URL.createObjectURL(ms);
    }

    ms.addEventListener("sourceopen", () => {
      // Important: Use the correct MIME type for your files (e.g., audio/mpeg)
      const sb = ms.addSourceBuffer("audio/mpeg");
      sourceBufferRef.current = sb;

      sb.addEventListener("updateend", () => {
        if (queueRef.current.length > 0 && !sb.updating) {
          sb.appendBuffer(queueRef.current.shift()!);
        }
      });
    });

    return () => {
      if (ms.readyState === "open") ms.endOfStream();
    };
  }, []);

  const checkBufferAndRequest = useCallback(() => {
    if (isDragging || isWaitingForChunk.current) return;

    const sb = sourceBufferRef.current;
    const audio = audioRef.current;

    if (sb && audio && !sb.updating) {
      const buffered = sb.buffered;
      let bufferedTime = 0;

      for (let i = 0; i < buffered.length; i++) {
        if (
          audio.currentTime >= buffered.start(i) &&
          audio.currentTime <= buffered.end(i)
        ) {
          bufferedTime = buffered.end(i) - audio.currentTime;
          break; 
        }
      }

      if (bufferedTime < 15 && serverState.playing) {
        isWaitingForChunk.current = true;
        send(JSON.stringify({ inst: "need_chunk" }));
      }
    }
  }, [send, isDragging, serverState.playing]);

  useEffect(() => {
    const interval = setInterval(checkBufferAndRequest, 500); // Check every 0.5 seconds
    return () => clearInterval(interval);
  }, [checkBufferAndRequest]);

  // Action Handlers
  // Audio Controls
  const togglePlay = useCallback(() => {
    const action = serverState.playing ? "pause" : "resume";
    send(JSON.stringify({ inst: action }));
  }, [serverState.playing, send]);

  const handleSeek = useCallback(
    (newTime: number) => {
      setServerState((prev) => ({ ...prev, position: newTime }));
      setIsDragging(true);

      if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current);

      seekTimeoutRef.current = setTimeout(() => {
        queueRef.current = [];

        if (sourceBufferRef.current && !sourceBufferRef.current.updating) {
          try {
            sourceBufferRef.current.remove(0, Number.MAX_SAFE_INTEGER);
          } catch (e) {
            console.error(e);
          }
        }

        send(JSON.stringify({ inst: "seek", params: { position: newTime } }));
        setIsDragging(false);
      }, 100);
    },
    [send],
  );
  // Search Bar
  const handleQueryChange = useCallback(
    (query: string) => {
      send(JSON.stringify({ inst: "search_query", params: { query: query } }));
    },
    [send],
  );

  const handleSearchSubmit = useCallback(
    (songName: string) => {
      setSongs([]);
      send(JSON.stringify({ inst: "search", params: { song_name: songName } }));
    },
    [send],
  );
  // Start Streaming
  const handlePlaySong = useCallback(
    (song: any) => {
      queueRef.current = [];
      if (sourceBufferRef.current && !sourceBufferRef.current.updating) {
        try {
          sourceBufferRef.current.remove(0, Number.MAX_SAFE_INTEGER);
        } catch (e) {}
      }

      send(
        JSON.stringify({
          inst: "start_streaming",
          params: {
            song_name: song.name,
            artist: song.artist,
          },
        }),
      );
    },
    [send],
  );
  // Refresh
  const handleRefresh = useCallback(() => {
    setSongs([]);
    setSuggestions([]);

    send(JSON.stringify({ inst: "get_top_songs", limit: 10 }));
  }, [send]);

  useEffect(() => {
    if (status === "connected") {
      handleRefresh();
    }
  }, [status, handleRefresh]);

  // memory cleanup
  useEffect(() => {
    return () => {
      songs.forEach((song) => {
        if (song.displayImage.startsWith("blob:")) {
          URL.revokeObjectURL(song.displayImage);
        }
      });
    };
  }, [songs]);

  return (
    <div className="h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,#2a1450_0%,#000_60%)]">
      <audio ref={audioRef} hidden />
      <div className="flex flex-row h-full">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-row h-16 px-6 py-3 gap-6 items-center">
            <ProfileMenu imageUrl={anonymousIcon} />
            <button
              onClick={handleRefresh}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all active:scale-95 border border-white/5"
            >
              <img
                src="../../assets/logo.png"
                alt="Meowify Logo"
                className="size-7 object-contain"
              />
            </button>
            <SearchBar
              onQueryChange={handleQueryChange}
              onSearchSubmit={handleSearchSubmit}
              suggestions={suggestions}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-10 custom-scrollbar">
            <div className="flex flex-col gap-2 max-w-4xl ml-auto">
              {songs.length > 0 ? (
                songs.map((song, index) => (
                  <div key={index} onClick={() => handlePlaySong(song)}>
                    <ContentFrame
                      name={song.name}
                      artist={song.artist}
                      album={song.album}
                      likes={song.likes_count}
                      imageUrl={song.displayImage}
                    />
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-right mt-20 opacity-50 select-none"></div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-col ml-auto">
          <MainMenu />
        </div>
      </div>
      <div className="mt-auto">
        <AudioControl
          songLen={currentSongLen}
          timePassed={serverState.position}
          isPlaying={serverState.playing}
          onTogglePlay={togglePlay}
          onSeek={handleSeek}
        />
      </div>
    </div>
  );
}

export default Home;
