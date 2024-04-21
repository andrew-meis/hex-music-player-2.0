import { Account, Client, Connection, Library, ServerConnection } from 'api';
import ky from 'ky';
import { store } from 'state';

const initApp = async () => {
  try {
    const appInfo = await window.api.getAppInfo();
    const serverConfig = await window.api.getServerConfig();
    const client = new Client({
      identifier: serverConfig?.clientId,
      product: appInfo.appName,
      version: appInfo.appVersion,
      device: appInfo.platform,
      deviceName: appInfo.hostname,
      platform: appInfo.platform,
      platformVersion: appInfo.platformVersion,
    });
    const account = new Account(client, serverConfig.authToken);
    const servers = await account.servers();
    const device = servers.devices.find((obj) => obj.name === serverConfig.serverName);
    if (!device) {
      return false;
    }
    const promises = device?.connections.map((_connection, index) => {
      const { uri } = device.connections[index];
      return ky(`${uri}/servers?X-Plex-Token=${device!.accessToken}`, {
        timeout: 10000,
      });
    });
    if (promises) {
      const connection: Connection = await Promise.race(promises).then(
        (r) => device!.connections.find((conn) => conn.uri === r.url.split('/servers')[0])!
      );
      const newAccount = new Account(client, device.accessToken);
      const newServerConnection = new ServerConnection(connection.uri, newAccount);
      const newLibrary = new Library(newServerConnection);
      store.serverConfig.set(serverConfig);
      store.account.set(newAccount);
      store.device.set({
        ...device,
        uri: `server://${device.clientIdentifier}/com.plexapp.plugins.library`,
      });
      store.library.set(newLibrary);
      return true;
    }
  } catch {
    return false;
  }
  return false;
};

const isAppInit = async () => {
  if (store.library.get()) {
    return true;
  }
  const loggedIn = await initApp();
  if (loggedIn) {
    return true;
  }
  return false;
};

export default isAppInit;
