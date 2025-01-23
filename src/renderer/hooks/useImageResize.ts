import { useSelector } from '@legendapp/state/react';
import { store } from 'state';

export const useImageResize = (params: URLSearchParams) =>
  useSelector(() => {
    const library = store.library.get();
    return library.resizeImage(params);
  });
