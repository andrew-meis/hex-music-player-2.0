import { useQuery } from '@tanstack/react-query';
import { Library } from 'api';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const historyQuery = (id: number, library: Library, sectionId: number) => ({
  queryKey: [QueryKeys.HISTORY, id],
  queryFn: () => library.history(id, sectionId),
  refetchOnWindowFocus: false,
});

const useHistory = (id: number) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(historyQuery(id, library, sectionId));
};

export default useHistory;
