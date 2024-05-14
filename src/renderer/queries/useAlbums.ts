import { useQuery } from '@tanstack/react-query';
import { Library } from 'api';
import paramsToObject from 'scripts/params-to-object';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const albumsQuery = (
  sectionId: number,
  library: Library,
  searchParams?: URLSearchParams
) => ({
  queryKey: [QueryKeys.ALBUMS, paramsToObject(searchParams?.entries())],
  queryFn: async () => library.albums(sectionId, searchParams),
});

const useAlbums = (searchParams?: URLSearchParams) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(albumsQuery(sectionId, library, searchParams));
};

export default useAlbums;
