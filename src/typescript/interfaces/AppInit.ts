import { Account, Device, Library } from 'api';

import { ServerConfig } from './ServerConfig';

export interface AppInit {
  account: Account;
  config: ServerConfig;
  device: Device;
  library: Library;
}
