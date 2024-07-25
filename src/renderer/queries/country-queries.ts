import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import { Library } from 'api';
import paramsToObject from 'scripts/params-to-object';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const countriesQuery = (
  sectionId: number,
  library: Library,
  searchParams?: URLSearchParams
) =>
  queryOptions({
    queryKey: [QueryKeys.COUNTRIES, paramsToObject(searchParams?.entries())],
    queryFn: async () => library.countries(sectionId, searchParams),
    placeholderData: keepPreviousData,
  });

export const useCountries = (searchParams?: URLSearchParams) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(countriesQuery(sectionId, library, searchParams));
};
