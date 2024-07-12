import { ElectronAPI } from '@electron-toolkit/preload';
import { AppInfo, PersistedStore, ReleaseFilters, ServerConfig } from 'typescript';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getAppInfo: () => Promise<AppInfo>;
      getValue: {
        (key: 'persisted-store'): Promise<PersistedStore>;
        (key: 'server-config'): Promise<ServerConfig>;
        (key: 'release-filters'): Promise<ReleaseFilters>;
      };
      setValue: {
        (key: 'persisted-store', value: PersistedStore): Promise<void>;
        (key: 'server-config', value: ServerConfig): Promise<void>;
        (key: 'release-filters', value: ReleaseFilters): Promise<void>;
      };
      setMode: (mode: 'dark' | 'light') => Promise<void>;
    };
  }
}
