import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import Store from 'electron-store';
import windowStateKeeper from 'electron-window-state';
import { hostname, release } from 'os';
import { join } from 'path';
import { AppInfo } from 'typescript';

import icon from '../../resources/icon.png?asset';

const store = new Store<{
  config: {
    clientId?: string;
    sectionId?: number;
    serverName?: string;
    token?: string;
  };
}>();

function createWindow() {
  // Load previous window state
  const mainWindowState = windowStateKeeper({
    defaultHeight: 466,
    defaultWidth: 800,
  });

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 800,
    minHeight: 488,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      height: 32,
    },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  // Register window state listeners
  mainWindowState.manage(mainWindow);

  ipcMain.handle('set-mode', (_event, mode) => {
    if (process.platform !== 'win32') return;
    if (mode === 'dark') {
      mainWindow.setTitleBarOverlay({
        color: '#00000000',
        symbolColor: '#ffffff',
      });
      return;
    }
    if (mode === 'light') {
      mainWindow.setTitleBarOverlay({
        color: '#ffffff00',
        symbolColor: '#000000',
      });
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.hex-music-vite.app');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  ipcMain.handle('get-app-info', () => {
    const platform = () => {
      switch (process.platform) {
        case 'darwin':
          return 'macOS';
        case 'linux':
          return 'Linux';
        case 'win32':
          return 'Windows';
        default:
          throw new Error('no matching platform');
      }
    };
    const appInfo: AppInfo = {
      appName: app.getName(),
      appVersion: app.getVersion(),
      hostname: hostname(),
      platform: platform(),
      platformVersion: release(),
    };
    return appInfo;
  });

  ipcMain.handle('get-server-config', () => {
    return store.get('server-config');
  });

  ipcMain.handle('set-server-config', (_event, serverConfig) => {
    store.set('server-config', serverConfig);
    return store.get('server-config');
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
