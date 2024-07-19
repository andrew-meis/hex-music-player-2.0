import { useQuery } from '@tanstack/react-query';
import { Account } from 'api';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const userQuery = (account: Account) => ({
  queryKey: [QueryKeys.USER],
  queryFn: () => account.info(),
});

export const useUser = () => {
  const account = store.account.get();
  return useQuery(userQuery(account));
};
