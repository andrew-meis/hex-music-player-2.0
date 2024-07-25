import { useQuery } from '@tanstack/react-query';
import { Library, MediaType } from 'api';
import paramsToObject from 'scripts/params-to-object';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const moodsQuery = (
  sectionId: number,
  library: Library,
  type: MediaType,
  searchParams?: URLSearchParams
) => ({
  queryKey: [QueryKeys.MOODS, type, paramsToObject(searchParams?.entries())],
  queryFn: async () => library.moods(sectionId, type, searchParams),
});

export const useMoods = (type: MediaType, searchParams?: URLSearchParams) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(moodsQuery(sectionId, library, type, searchParams));
};
