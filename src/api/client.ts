import ky from 'ky';
import * as uuid from 'uuid';

interface ClientOptions {
  device?: string;
  deviceName?: string;
  identifier?: string;
  platform?: string;
  platformVersion?: string;
  product?: string;
  version?: string;
}

export interface PinResponse {
  id: number;
  code: string;
  product: string;
  trusted: boolean;
  qr: string;
  clientIdentifier: string;
  location: Location;
  expiresIn: number;
  createdAt: string;
  expiresAt: string;
  authToken?: null;
  newRegistration?: null;
}

export interface Location {
  code: string;
  european_union_member: boolean;
  continent_code: string;
  country: string;
  city: string;
  time_zone: string;
  postal_code: string;
  in_privacy_restricted_country: boolean;
  subdivisions: string;
  coordinates: string;
}

/**
 * A Plex API client
 *
 * @class Client
 * @param {Object} options
 * @param {string} options.device
 * @param {string} options.deviceName
 * @param {string} options.identifier
 * @param {string} options.platform
 * @param {string} options.platformVersion
 * @param {string} options.product
 * @param {string} options.version
 */

export default class Client {
  public device: string;

  public deviceName: string;

  public identifier: string;

  public platform: string;

  public platformVersion: string;

  public product: string;

  public version: string;

  constructor(options: ClientOptions = {}) {
    this.device = options.device || 'No platform specified';
    this.deviceName = options.deviceName || 'PC';
    this.identifier = options.identifier || uuid.v4();
    this.platform = options.platform || 'PC';
    this.platformVersion = options.platformVersion || 'No version specified';
    this.product = options.product || 'hex-music-tauri';
    this.version = options.version || '1.0.0';
  }

  /**
   * All the headers that let Plex know which device is making the request
   *
   * @private
   * @returns {Object}
   */

  headers(): Record<string, string> {
    return {
      'X-Plex-Client-Identifier': this.identifier,
      'X-Plex-Device': this.device,
      'X-Plex-Device-Name': this.deviceName,
      'X-Plex-Platform': this.platform,
      'X-Plex-Platform-Version': this.platformVersion,
      'X-Plex-Product': this.product,
      'X-Plex-Provides': 'player',
      'X-Plex-Version': this.version,
    };
  }

  pin(): Promise<PinResponse> {
    const response = ky
      .post('https://plex.tv/api/v2/pins', {
        headers: {
          accept: 'application/json',
        },
        searchParams: {
          'X-Plex-Client-Identifier': this.identifier,
          'X-Plex-Product': this.product,
          strong: true,
        },
      })
      .json() as Promise<PinResponse>;
    return response;
  }
}
