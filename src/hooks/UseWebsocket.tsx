import { useEffect, useRef, useCallback, useState } from "react";

export type WSStatus = "connecting" | "connected" | "disconnected" | "error";

export interface UseWebSocketOptions {
  url: string;
  onAudioChunk?: (chunk: ArrayBuffer) => void;
  onMessage?: (data: unknown) => void;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

export interface UseWebSocketReturn {
  status: WSStatus;
  send: (data: string | ArrayBuffer | Blob) => void;
  disconnect: () => void;
  reconnect: () => void;
}

export function useWebSocket({
  url,
  onAudioChunk,
  onMessage,
  reconnectDelay = 2000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isManuallyClosed = useRef(false);

  const [status, setStatus] = useState<WSStatus>("disconnected");

  const clearReconnectTimer = () => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
  };

  const connect = useCallback(() => {
    // Clean up any existing connection
    if (wsRef.current) {
      wsRef.current.onclose = null; // prevent reconnect loop
      wsRef.current.close();
    }

    isManuallyClosed.current = false;
    setStatus("connecting");

    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer"; // critical for audio chunks

    ws.onopen = () => {
      setStatus("connected");
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event: MessageEvent) => {
      if (event.data instanceof ArrayBuffer) {
        // Binary frame → treat as audio chunk
        onAudioChunk?.(event.data);
      } else {
        // Text frame → JSON control message
        try {
          const parsed = JSON.parse(event.data as string);
          onMessage?.(parsed);
        } catch {
          onMessage?.(event.data);
        }
      }
    };

    ws.onerror = () => {
      setStatus("error");
    };

    ws.onclose = () => {
      setStatus("disconnected");
      wsRef.current = null;

      if (
        !isManuallyClosed.current &&
        reconnectAttempts.current < maxReconnectAttempts
      ) {
        reconnectAttempts.current += 1;
        reconnectTimer.current = setTimeout(() => {
          connect();
        }, reconnectDelay * reconnectAttempts.current); // back-off
      }
    };

    wsRef.current = ws;
  }, [url, onAudioChunk, onMessage, reconnectDelay, maxReconnectAttempts]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => {
      isManuallyClosed.current = true;
      clearReconnectTimer();
      wsRef.current?.close();
    };
  }, [connect]);

  const send = useCallback((data: string | ArrayBuffer | Blob) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    } else {
      console.warn("[WS] Tried to send while not connected");
    }
  }, []);

  const disconnect = useCallback(() => {
    isManuallyClosed.current = true;
    clearReconnectTimer();
    wsRef.current?.close();
  }, []);

  const reconnect = useCallback(() => {
    clearReconnectTimer();
    reconnectAttempts.current = 0;
    connect();
  }, [connect]);

  return { status, send, disconnect, reconnect };
}