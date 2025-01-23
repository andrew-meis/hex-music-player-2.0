import isAppInit from 'scripts/init-app';

export const libraryLoader = async () => {
  const initialized = await isAppInit();
  return initialized;
};
