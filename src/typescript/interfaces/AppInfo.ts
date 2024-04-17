export interface AppInfo {
  appName: string;
  appVersion: string;
  hostname: string;
  platform: 'macOS' | 'Linux' | 'Windows';
  platformVersion: string;
}
