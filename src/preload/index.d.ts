import { ElectronAPI } from '@electron-toolkit/preload';
import PreciseAudio from '@synesthesia-project/precise-audio/lib';
import { AppInfo, ServerConfig } from 'typescript';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getAppInfo: () => Promise<AppInfo>;
      getServerConfig: () => Promise<ServerConfig>;
      setServerConfig: (serverConfig: ServerConfig) => Promise<ServerConfig>;
      setMode: (mode: 'dark' | 'light') => Promise<void>;
    };
    audio: PreciseAudio;
  }
}
