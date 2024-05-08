import { observer, reactive, useObserve, useUnmount } from '@legendapp/state/react';
import { Box, Chip, ClickAwayListener } from '@mui/material';
import { Track } from 'api';
import TrackRow from 'components/track/TrackRow';
import Scroller from 'components/virtuoso/Scroller';
import { useLastfmMatchTracks, useRecentTracks, useRelatedTracks, useSimilarTracks } from 'queries';
import React from 'react';
import { FiRadio } from 'react-icons/fi';
import { ImLastfm } from 'react-icons/im';
import { IoMdMicrophone } from 'react-icons/io';
import { PiWaveform } from 'react-icons/pi';
import { Virtuoso } from 'react-virtuoso';
import { store } from 'state';
import { selectActions } from 'ui/select';

const ReactiveChip = reactive(Chip);

const Item: React.FC<{
  data: Track;
  index: number;
}> = ({ data, index }) => <TrackRow index={index} track={data} />;

const NowPlayingSimilar: React.FC = observer(function NowPlayingSimilar() {
  const nowPlaying = store.queue.nowPlaying.get();
  const activeChip = store.ui.nowPlaying.activeSimilarTracksChip.get();

  useObserve(store.queue.nowPlaying, ({ value }) => {
    if (value?.id === nowPlaying.id) return;
    store.ui.nowPlaying.activeSimilarTracksChip.set(0);
  });

  useUnmount(() => selectActions.handleClickAway());

  const { data: recentTracks } = useRecentTracks(nowPlaying.track, 90, activeChip === 0);

  const { data: similarTracks } = useSimilarTracks(nowPlaying.track, activeChip === 1);

  const { data: relatedTracks } = useRelatedTracks(nowPlaying.track, activeChip === 2);

  const { data: lastfmMatchTracks } = useLastfmMatchTracks(nowPlaying.track, activeChip === 3);

  const activeData =
    activeChip === 0
      ? recentTracks?.filter((track) => track.guid !== nowPlaying.track.guid) || []
      : activeChip === 1
        ? similarTracks?.tracks || []
        : activeChip === 2
          ? relatedTracks || []
          : activeChip === 3
            ? lastfmMatchTracks || []
            : [];

  const chips = [
    {
      label: `More by${' '}
      ${
        nowPlaying.track.grandparentTitle === 'Various Artists'
          ? nowPlaying.track.originalTitle
          : nowPlaying.track.grandparentTitle
      }`,
      icon: <IoMdMicrophone />,
    },
    {
      label: 'Sonically Similar',
      icon: <PiWaveform />,
    },
    {
      label: 'Related Tracks',
      icon: <FiRadio />,
    },
    {
      label: 'last.fm Similar',
      icon: <ImLastfm viewBox="0 0 17 17" />,
    },
  ];

  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="-webkit-fill-available"
      margin={2}
      width="calc(100% - 80px)"
    >
      <Box display="flex" gap={1} justifyContent="center" width={1}>
        {chips.map((value, index) => (
          <ReactiveChip
            $sx={() => ({
              fontWeight: store.ui.nowPlaying.activeSimilarTracksChip.get() === index ? 700 : 500,
              maxWidth: 256,
            })}
            icon={value.icon}
            key={value.label}
            label={value.label}
            size="small"
            onClick={() => {
              store.ui.select.selected.set([]);
              store.ui.nowPlaying.activeSimilarTracksChip.set(index);
            }}
          />
        ))}
      </Box>
      <ClickAwayListener
        onClickAway={(event) => {
          if (store.ui.select.items.peek() === activeData) {
            selectActions.handleClickAway(event);
          }
        }}
      >
        <Virtuoso
          components={{
            Scroller,
          }}
          data={activeData}
          isScrolling={handleScrollState}
          itemContent={(index, data) => <Item data={data} index={index} />}
          style={{ height: '100%', marginTop: 16 }}
          onMouseOver={() => store.ui.select.items.set(activeData)}
        />
      </ClickAwayListener>
    </Box>
  );
});

export default NowPlayingSimilar;
