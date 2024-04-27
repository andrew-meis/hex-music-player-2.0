import { useQuery } from '@tanstack/react-query';
import { Library, MediaType, Params } from 'api';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const genresQuery = (
  sectionId: number,
  library: Library,
  type: MediaType,
  params?: Params
) => ({
  queryKey: [QueryKeys.GENRES, type, params],
  queryFn: async () => library.genres(sectionId, type, params),
});

const useGenres = (type: MediaType, params?: Params) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(genresQuery(sectionId, library, type, params));
};

export default useGenres;
