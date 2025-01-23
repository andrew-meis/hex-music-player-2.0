import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Vibrant } from 'node-vibrant/browser';
import { QueryKeys } from 'typescript';

type UseColorsParams = {
  id: string;
  url: string;
};

export const useColorPalette = ({ id, url }: UseColorsParams) =>
  useQuery({
    queryKey: [QueryKeys.PALETTE, id],
    queryFn: () => Vibrant.from(url).getPalette(),
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: Infinity,
  });
