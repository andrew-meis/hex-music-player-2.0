import { XMLParser } from 'fast-xml-parser';
import ky, { Options as KyOptions, ResponsePromise } from 'ky';

export interface RequestOptions extends KyOptions {
  searchParams?: URLSearchParams;
  headers?: Record<string, string>;
}

const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '',
  attributesGroupName: '$',
};

const parser = new XMLParser(parserOptions);
const parse = async (text: string): Promise<Record<string, any>> => parser.parse(text);

const cleanHeaders = (headers: Record<string, string> = {}): Record<string, string> => {
  Object.keys(headers).forEach((key) => {
    if (headers[key] === undefined) {
      delete headers[key];
    }
  });
  return headers;
};

const request = (url: string, options: RequestOptions = {}): ResponsePromise => {
  const { method, body, json, searchParams, prefixUrl, retry, timeout, throwHttpErrors, headers } =
    options;

  cleanHeaders(options.headers as Record<string, string>);

  return ky(url, {
    method,
    body,
    json,
    searchParams,
    prefixUrl,
    retry,
    timeout,
    throwHttpErrors,
    hooks: {
      beforeRequest: [
        (req): void => {
          if (!headers) return;
          Object.keys(headers).forEach((key) => {
            req.headers.set(key, headers[key]);
          });
        },
      ],
    },
  });
};

const requestJSON = async (
  url: string,
  options: RequestOptions = {}
): Promise<Record<string, unknown>> => {
  const res = await request(url, {
    timeout: 1000 * 60,
    ...options,
    headers: { accept: 'application/json', ...options.headers },
  });

  if (res.headers.get('content-type')?.includes('application/json')) {
    return res.json();
  }

  return { data: res.text() };
};

const requestXML = async (url: string, options: RequestOptions): Promise<object> => {
  const res = await request(url, options);
  const text = await res.text();
  const xml = await parse(text);
  if (Array.isArray(xml.MediaContainer.Device)) {
    return xml;
  }
  return { ...xml, MediaContainer: { ...xml.MediaContainer, Device: [xml.MediaContainer.Device] } };
};

export { request, requestJSON, requestXML };
