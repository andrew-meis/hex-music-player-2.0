import { observer, useUnmount } from '@legendapp/state/react';
import { ClickAwayListener } from '@mui/material';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Track } from 'api';
import { trackColumns } from 'components/track/columns';
import TrackRow from 'components/track/TrackRow';
import Scroller from 'components/virtuoso/Scroller';
import { selectActions } from 'features/select';
import { useSimilarTracks } from 'queries';
import React, { useMemo } from 'react';
import { ItemProps, TableProps, TableVirtuoso } from 'react-virtuoso';
import { store } from 'state';
import { ActiveMenu } from 'typescript';

import { nowPlayingSelectState } from '../NowPlayingSimilar';

const SimilarSonically: React.FC = observer(function SimilarSonically() {
  const columns = useMemo(() => trackColumns, []);

  const tabIsAnimating = store.ui.nowPlaying.tabIsAnimating.get();
  const nowPlaying = store.queue.nowPlaying.get();
  const { data: similarTracks } = useSimilarTracks(nowPlaying.track, !tabIsAnimating);

  const slicedTracks = useMemo(() => similarTracks?.tracks.slice(0, 10), [similarTracks]);

  useUnmount(() => selectActions.handleClickAway(nowPlayingSelectState));

  const table = useReactTable({
    data: slicedTracks || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  if (!similarTracks) return null;

  return (
    <ClickAwayListener
      onClickAway={(event) => selectActions.handleClickAway(nowPlayingSelectState, event)}
    >
      <TableVirtuoso
        components={{
          Scroller,
          Table: ({ style, ...props }: TableProps) => (
            <table
              {...props}
              style={{
                ...style,
                width: '-webkit-fill-available',
                tableLayout: 'fixed',
              }}
            />
          ),
          TableRow: (props: ItemProps<Track>) => {
            const index = props['data-index'];
            const row = rows[index];

            return (
              <TrackRow index={index} state={nowPlayingSelectState} {...props}>
                {row.getVisibleCells().map((cell) => (
                  <td className={cell.column.id} key={cell.id} style={{ padding: '0 8px' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </TrackRow>
            );
          },
        }}
        isScrolling={handleScrollState}
        style={{
          height: 'calc(100% - 16px)',
          marginTop: 16,
          overscrollBehavior: 'contain',
          width: '100%',
        }}
        totalCount={rows.length}
        onMouseOver={() => {
          store.ui.menus.activeMenu.set(ActiveMenu.NOW_PLAYING);
          nowPlayingSelectState.items.set(slicedTracks);
        }}
      />
    </ClickAwayListener>
  );
});

export default SimilarSonically;
