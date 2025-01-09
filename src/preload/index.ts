import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

interface NavigationUpdate {
  backward: boolean;
  forward: boolean;
}

// Custom APIs for renderer
const api = {
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  getValue: (key: string) => ipcRenderer.invoke('get-value', key),
  setValue: (key: string, value: object) => ipcRenderer.invoke('set-value', key, value),
  setMode: (mode: 'dark' | 'light') => ipcRenderer.invoke('set-mode', mode),
  onNavigationUpdate: (callback: (event: IpcRendererEvent, args: NavigationUpdate) => void) =>
    ipcRenderer.on('nav-update', callback),
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
