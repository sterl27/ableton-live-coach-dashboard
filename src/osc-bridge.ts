type TransportCommand = 'play' | 'stop' | 'record' | 'rewind' | 'forward';

interface OscBridgeConfig {
  host: string;
  port: number;
}

const DEFAULT_CONFIG: OscBridgeConfig = {
  host: import.meta.env.VITE_OSC_BRIDGE_HOST || 'localhost',
  port: Number(import.meta.env.VITE_OSC_BRIDGE_PORT) || 9000,
};

let ws: WebSocket | null = null;
let connected = false;

export function isOscConnected(): boolean {
  return connected;
}

export function connectOscBridge(
  config: OscBridgeConfig = DEFAULT_CONFIG,
  onStatus?: (connected: boolean) => void,
): () => void {
  const url = `ws://${config.host}:${config.port}`;

  try {
    ws = new WebSocket(url);

    ws.onopen = () => {
      connected = true;
      onStatus?.(true);
    };

    ws.onclose = () => {
      connected = false;
      onStatus?.(false);
    };

    ws.onerror = () => {
      connected = false;
      onStatus?.(false);
    };
  } catch {
    connected = false;
    onStatus?.(false);
  }

  return () => {
    ws?.close();
    ws = null;
    connected = false;
  };
}

export function sendTransport(command: TransportCommand): void {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;

  const oscAddress: Record<TransportCommand, string> = {
    play: '/live/play',
    stop: '/live/stop',
    record: '/live/record',
    rewind: '/live/rew',
    forward: '/live/ff',
  };

  ws.send(JSON.stringify({
    address: oscAddress[command],
    args: [],
  }));
}

export function sendParameter(address: string, value: number): void {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ address, args: [value] }));
}
