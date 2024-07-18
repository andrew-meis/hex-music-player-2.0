import { useQuery } from '@tanstack/react-query';
import { Library, MediaType } from 'api';
import paramsToObject from 'scripts/params-to-object';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const genresQuery = (
  sectionId: number,
  library: Library,
  type: MediaType,
  searchParams?: URLSearchParams
) => ({
  queryKey: [QueryKeys.GENRES, type, paramsToObject(searchParams?.entries())],
  queryFn: async () => library.genres(sectionId, type, searchParams),
});

export const useGenres = (type: MediaType, searchParams?: URLSearchParams) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(genresQuery(sectionId, library, type, searchParams));
};
