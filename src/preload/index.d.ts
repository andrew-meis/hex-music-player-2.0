import { ElectronAPI } from '@electron-toolkit/preload';
import { AppInfo, ServerConfig } from 'typescript';

import { PersistedStore } from './index';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getAppInfo: () => Promise<AppInfo>;
      getServerConfig: () => Promise<ServerConfig>;
      setServerConfig: (serverConfig: ServerConfig) => Promise<ServerConfig>;
      getPersistedStore: () => Promise<PersistedStore>;
      setPersistedStore: (persistedStore: PersistedStore) => Promise<PersistedStore>;
      setMode: (mode: 'dark' | 'light') => Promise<void>;
    };
  }
}
