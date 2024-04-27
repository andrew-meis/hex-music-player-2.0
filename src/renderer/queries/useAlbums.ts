import { useQuery } from '@tanstack/react-query';
import { Library, Params } from 'api';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const albumsQuery = (sectionId: number, library: Library, params?: Params) => ({
  queryKey: [QueryKeys.ALBUMS, params],
  queryFn: async () => library.albums(sectionId, params),
});

const useAlbums = (params?: Params) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(albumsQuery(sectionId, library, params));
};

export default useAlbums;
