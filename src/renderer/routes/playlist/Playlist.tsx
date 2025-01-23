import { observer } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import { useKeyboardEvent } from '@react-hookz/web';
import VirtualPlaylistItemTable from 'components/playlist/VirtualPlaylistItemTable';
import { playlistActions } from 'features/playlist';
import { usePlaylistItems } from 'queries';
import React, { useCallback, useEffect } from 'react';
import emoji from 'react-easy-emoji';
import { createSearchParams } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const Playlist: React.FC = observer(function Playlist() {
  const { id, title } = store.loaders.playlist.get();

  const selectObservable = allSelectObservables[SelectObservables.ROUTE_PLAYLIST];

  const { data, refetch } = usePlaylistItems(id);

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Playlists',
        to: {
          pathname: '/playlists',
          search: createSearchParams({ section: 'Playlists' }).toString(),
        },
      },
      {
        title,
        to: {
          pathname: `/playlists/${id}`,
          search: createSearchParams({ title }).toString(),
        },
      },
    ]);
  }, [data]);

  const handleDelete = useCallback(async () => {
    const ids = selectObservable.selectedItems.peek().map((item) => item.id);
    if (ids.length === 0) return;
    if (data?.smart) {
      store.ui.toasts.set((prev) => [
        ...prev,
        { message: 'Cannot edit smart playlist', key: new Date().getTime() },
      ]);
      return;
    }
    selectObservable.selectedIndexes.set([]);
    await playlistActions.removeFromPlaylist(id, ids);
    refetch();
  }, [data]);

  useKeyboardEvent('Delete', handleDelete, [], { eventOptions: { passive: true } });

  if (!data) return null;

  return (
    <RouteContainer>
      {({ viewport }) => (
        <>
          <Typography variant="h1">{emoji(title)}</Typography>
          <VirtualPlaylistItemTable
            activeMenu={SelectObservables.ROUTE_PLAYLIST}
            items={data.items || []}
            state={selectObservable}
            viewport={viewport}
          />
        </>
      )}
    </RouteContainer>
  );
});

export default Playlist;
