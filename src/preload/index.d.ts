import { ElectronAPI } from '@electron-toolkit/preload';
import { IpcRendererEvent } from 'electron';
import { AppInfo, PersistedStore, ServerConfig } from 'typescript';

interface NavigationUpdate {
  backward: boolean;
  forward: boolean;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getAppInfo: () => Promise<AppInfo>;
      getValue: {
        (key: 'persisted-store'): Promise<PersistedStore>;
        (key: 'server-config'): Promise<ServerConfig>;
      };
      setValue: {
        (key: 'persisted-store', value: PersistedStore): Promise<void>;
        (key: 'server-config', value: ServerConfig): Promise<void>;
      };
      setMode: (mode: 'dark' | 'light') => Promise<void>;
      onNavigationUpdate: (
        callback: (event: IpcRendererEvent, args: NavigationUpdate) => void
      ) => Electron.IpcRenderer;
    };
  }
}
