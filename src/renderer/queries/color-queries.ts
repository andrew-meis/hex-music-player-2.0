import { keepPreviousData, useQuery } from '@tanstack/react-query';
import chroma, { Color } from 'chroma-js';
import ColorThief from 'colorthief';
import { uniq } from 'lodash';
import { QueryKeys } from 'typescript';

type UseColorsParams = {
  id: string;
  url: string;
};

const getColor = (url: string): Promise<Color> => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject();
    }
    const image = new Image();
    image.src = url;
    image.crossOrigin = 'Anonymous';

    image.onload = function () {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(this as HTMLImageElement, 10)!;
      const result = chroma(color);
      resolve(result);
    };
  });
};

const getPalette = (url: string): Promise<Color[]> => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject();
    }
    const image = new Image();
    image.src = url;
    image.crossOrigin = 'Anonymous';

    image.onload = function () {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(this as HTMLImageElement, 10);
      const result = uniq(palette).map((value) => chroma(value));
      resolve(result);
    };
  });
};

export const useColorThiefColor = ({ id, url }: UseColorsParams) =>
  useQuery({
    queryKey: [QueryKeys.COLOR, id],
    queryFn: () => getColor(url),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

export const useColorThiefPalette = ({ id, url }: UseColorsParams) =>
  useQuery({
    queryKey: [QueryKeys.PALETTE, id],
    queryFn: () => getPalette(url),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
