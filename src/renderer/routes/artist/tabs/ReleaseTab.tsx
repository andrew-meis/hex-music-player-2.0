import { observer } from '@legendapp/state/react';
import { Box, ClickAwayListener } from '@mui/material';
import { Album } from 'api';
import AlbumCard from 'components/album/AlbumCard';
import { Item, List } from 'components/virtuoso/CustomGridComponents';
import { sort } from 'fast-sort';
import { selectActions } from 'features/select';
import React, { useMemo } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { allSelectObservables, persistedStore, store } from 'state';
import { SelectObservables } from 'typescript';

const ReleaseTab: React.FC<{
  releases: Album[];
  subtext?: keyof Album;
  viewport: HTMLDivElement | undefined;
}> = observer(function ReleaseTab({ releases, subtext, viewport }) {
  const selectObservable = allSelectObservables[SelectObservables.ROUTE_ARTIST_RELEASES];

  const sorting = persistedStore.sorting.get();
  const sorted = useMemo(() => sort(releases)[sorting.order](sorting.key), [releases, sorting]);

  return (
    <ClickAwayListener
      onClickAway={(event) => selectActions.handleClickAway(selectObservable, event)}
    >
      <Box minHeight="var(--content-height)" paddingTop={3}>
        <VirtuosoGrid
          components={{ List, Item }}
          customScrollParent={viewport}
          data={sorted}
          itemContent={(index, data) => (
            <AlbumCard
              album={data}
              index={index}
              state={selectObservable}
              subtext={subtext || sorting.key}
            />
          )}
          style={{
            scrollbarWidth: 'none',
          }}
          totalCount={sorted.length}
          onMouseOver={() => {
            store.ui.menus.activeMenu.set(SelectObservables.ROUTE_ARTIST_RELEASES);
            selectObservable.items.set(sorted);
          }}
        />
      </Box>
    </ClickAwayListener>
  );
});

export default ReleaseTab;
