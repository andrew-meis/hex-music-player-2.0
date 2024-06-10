import { observer, useUnmount } from '@legendapp/state/react';
import { ClickAwayListener } from '@mui/material';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { SORT_TRACKS_BY_PLAYS, Track } from 'api';
import { trackColumns } from 'components/track/columns';
import TrackRow from 'components/track/TrackRow';
import Scroller from 'components/virtuoso/Scroller';
import { selectActions } from 'features/select';
import { useArtistTracks } from 'queries';
import React, { useMemo } from 'react';
import { ItemProps, TableProps, TableVirtuoso } from 'react-virtuoso';
import { store } from 'state';
import { ActiveMenu } from 'typescript';

import { nowPlayingSelectState } from '../NowPlayingSimilar';

const MoreByArtist: React.FC = observer(function SimilarMoreByArtist() {
  const columns = useMemo(() => trackColumns, []);

  const tabIsAnimating = store.ui.nowPlaying.tabIsAnimating.get();
  const nowPlaying = store.queue.nowPlaying.get();
  const { data: artistTracks } = useArtistTracks(
    nowPlaying.track.grandparentGuid,
    nowPlaying.track.grandparentId,
    SORT_TRACKS_BY_PLAYS.desc,
    nowPlaying.track.grandparentTitle,
    !tabIsAnimating,
    true
  );

  useUnmount(() => selectActions.handleClickAway(nowPlayingSelectState));

  const slicedTracks = useMemo(
    () => artistTracks?.tracks.filter((track) => track.guid !== nowPlaying.track.guid).slice(0, 50),
    [artistTracks]
  );

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

  if (!artistTracks) return null;

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

export default MoreByArtist;
