const withParams = (url: string, params: URLSearchParams): string => {
  if (params.size) {
    return `${url}?${params.toString()}`;
  }
  return url;
};

/**
 * Handle container params.
 * Important: the `start` parameter is only respected by Plex if you pass the `size` parameter as well.
 */

const withContainerParams = (params: URLSearchParams | undefined) => {
  if (!params) return params;
  const start = params.get('start');
  const size = params.get('size');

  if (size != null) {
    params.delete('size');
    params.append('X-Plex-Container-Size', size);
    params.delete('start');
    params.append('X-Plex-Container-Start', start != null ? start.toString() : '0');
  }

  return params;
};

export { withContainerParams, withParams };
