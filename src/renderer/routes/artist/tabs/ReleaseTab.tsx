import { Box } from '@mui/material';
import { Album } from 'api';
import AlbumCard from 'components/album/AlbumCard';
import { Item, List } from 'components/virtuoso/CustomGridComponents';
import React from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const ReleaseTab: React.FC<{
  releases: Album[];
  viewport: HTMLDivElement | undefined;
}> = ({ releases, viewport }) => {
  const selectObservable = allSelectObservables[SelectObservables.ROUTE_ARTIST_RELEASES];

  return (
    <Box minHeight="var(--content-height)">
      <Box height={32} paddingBottom={2} paddingTop={3} />
      <VirtuosoGrid
        components={{ List, Item }}
        customScrollParent={viewport}
        data={releases}
        itemContent={(index, data) => (
          <AlbumCard album={data} index={index} state={selectObservable} />
        )}
        style={{
          scrollbarWidth: 'none',
        }}
        totalCount={releases.length}
        onMouseOver={() => {
          store.ui.menus.activeMenu.set(SelectObservables.ROUTE_ARTIST_RELEASES);
          selectObservable.items.set(releases);
        }}
      />
    </Box>
  );
};

export default ReleaseTab;
