import { useRef, useCallback } from "react";
import ProfileMenu from "../components/ProfileMenu";
import SearchBar from "../components/SearchBar";
import anonymousIcon from "../assets/anonymous.png";
import MainMenu from "../components/MainMenu";
import AudioControl from "../components/AudioControl";
import { useWebSocket } from "../hooks/UseWebsocket";

const WS_URL = "ws://localhost:8080/";

// Minimal status badge
function ConnectionBadge({ status, onClick }: { status: string; onClick: any }) {
  const colors: Record<string, string> = {
    connected: "bg-green-500",
    connecting: "bg-yellow-400 animate-pulse",
    disconnected: "bg-gray-500",
    error: "bg-red-500",
  };
  return (
    <div onClick={onClick} className="cursor-pointer">
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs text-white font-medium ${colors[status] ?? "bg-gray-500"}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
        {status}
      </span>
    </div>
  );
}

function Home() {
  // Queue incoming audio chunks and play them in order via the Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  };

  const handleAudioChunk = useCallback(async (chunk: ArrayBuffer) => {
    const ctx = getAudioCtx();

    try {
      const audioBuffer = await ctx.decodeAudioData(chunk.slice(0)); // slice = defensive copy
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      // Schedule chunks back-to-back for gapless playback
      const startAt = Math.max(ctx.currentTime, nextStartTimeRef.current);
      source.start(startAt);
      nextStartTimeRef.current = startAt + audioBuffer.duration;
    } catch (err) {
      console.error("[Audio] Failed to decode chunk:", err);
    }
  }, []);

  const handleMessage = useCallback((data: unknown) => {
    // Handle JSON control messages from your Python backend, e.g.:
    // { type: "track_info", title: "...", duration: 180 }
    // { type: "playback_ended" }
    console.log("[WS message]", data);
  }, []);

  const { status, send, reconnect } = useWebSocket({
    url: WS_URL,
    onAudioChunk: handleAudioChunk,
    onMessage: handleMessage,
  });

  // Example: tell the server to start streaming a track
  const requestTrack = useCallback(
    (trackId: string) => {
      send(JSON.stringify({ type: "play", trackId }));
    },
    [send],
  );

  return (
    <div className="h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,#2a1450_0%,#000_60%)]">
      <div className="flex flex-row h-full">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-row h-16 px-6 py-3 gap-150 items-center">
            <ProfileMenu imageUrl={anonymousIcon} />
            <SearchBar />
            {/* Connection status — visible in the header */}
            <div className="ml-auto flex items-center gap-2 ">
              <ConnectionBadge status={status} onClick={reconnect} />
            </div>
          </div>
        </div>
        <div className="flex-col ml-auto">
          <MainMenu />
        </div>
      </div>
      <div className="mt-auto">
        {/* Pass requestTrack down if AudioControl needs to trigger playback */}
        <AudioControl songLen={180} onPlay={requestTrack} />
      </div>
    </div>
  );
}

export default Home;