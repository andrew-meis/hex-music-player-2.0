import Account from './account';
import { withParams } from './utils/params';
import { requestJSON, RequestOptions } from './utils/request';

/**
 * A connection to a Plex server
 */

export default class ServerConnection {
  public uri: string;

  public account: Account;

  constructor(uri: string, account: Account) {
    this.uri = uri;
    this.account = account;
  }

  /**
   * Get headers
   */

  headers() {
    return this.account && this.account.headers();
  }

  /**
   * Given a path, return a fully qualified URL
   */

  getUrl(path: string, searchParams: URLSearchParams = new URLSearchParams()) {
    return withParams(this.uri + path, searchParams);
  }

  /**
   * Given a path, return a fully qualified URL
   * Includes the X-Plex-Token parameter in the URL
   */

  getAuthenticatedUrl(path: string, searchParams: URLSearchParams = new URLSearchParams()) {
    searchParams.append('X-Plex-Token', this.headers()['X-Plex-Token']);
    return this.getUrl(path, searchParams);
  }

  /**
   * Fetch a path on this server as JSON. If the response is not JSON, it will
   * return a promise of the response.
   */

  fetch(path: string, options: RequestOptions = {}) {
    const url = this.getUrl(path);
    return requestJSON(url, {
      ...options,
      headers: {
        ...this.headers(),
        ...options.headers,
      },
    });
  }
}