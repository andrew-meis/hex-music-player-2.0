import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';
import { ServerConfig } from 'typescript';

export interface PersistedStore {
  audio: {
    volume: number;
  };
  displayRemainingTime: boolean;
  lastfmApiKey: string;
  lyricsSize: number;
  queueId: number;
  recentSearches: string[];
}

// Custom APIs for renderer
const api = {
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  getServerConfig: () => ipcRenderer.invoke('get-server-config'),
  setServerConfig: (serverConfig: ServerConfig) =>
    ipcRenderer.invoke('set-server-config', serverConfig),
  getPersistedStore: () => ipcRenderer.invoke('get-persisted-store'),
  setPersistedStore: (persistedStore: PersistedStore) =>
    ipcRenderer.invoke('set-persisted-store', persistedStore),
  setMode: (mode: 'dark' | 'light') => ipcRenderer.invoke('set-mode', mode),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in d.ts)
  window.electron = electronAPI;
  // @ts-ignore (define in d.ts)
  window.api = api;
}
