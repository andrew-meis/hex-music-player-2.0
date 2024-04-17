export type Params = Record<string, string | number | boolean>;

const withParams = (url: string, params: Params = {}): string => {
  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params as Record<string, string>);
    return `${url}?${searchParams.toString()}`;
  }
  return url;
};

/**
 * Handle container params.
 * Important: the `start` parameter is only respected by Plex if you pass the `size` parameter as well.
 */

interface WithContainerParamsOptions {
  start?: number;
  size?: number;
}

type WithContainerParams = Params | WithContainerParamsOptions;

const withContainerParams = (params: WithContainerParams = {}) => {
  const { start, size, ...searchParams } = params;

  if (size != null) {
    searchParams['X-Plex-Container-Size'] = size.toString();
    searchParams['X-Plex-Container-Start'] = start != null ? start.toString() : '0';
  }

  return searchParams;
};

export { withContainerParams, withParams };
