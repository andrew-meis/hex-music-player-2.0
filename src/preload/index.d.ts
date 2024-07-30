import { ElectronAPI } from '@electron-toolkit/preload';
import { AppearsOnFilters, AppInfo, PersistedStore, ServerConfig } from 'typescript';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getAppInfo: () => Promise<AppInfo>;
      getValue: {
        (key: 'persisted-store'): Promise<PersistedStore>;
        (key: 'server-config'): Promise<ServerConfig>;
        (key: 'appears-on-filters'): Promise<AppearsOnFilters>;
      };
      setValue: {
        (key: 'persisted-store', value: PersistedStore): Promise<void>;
        (key: 'server-config', value: ServerConfig): Promise<void>;
        (key: 'appears-on-filters', value: AppearsOnFilters): Promise<void>;
      };
      setMode: (mode: 'dark' | 'light') => Promise<void>;
    };
  }
}
