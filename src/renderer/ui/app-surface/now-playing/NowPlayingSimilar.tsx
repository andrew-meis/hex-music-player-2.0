import { observer, reactive } from '@legendapp/state/react';
import { Box, Chip } from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import { Track } from 'api';
import Scroller from 'components/scroller/Scroller';
import { LastFMTrack } from 'lastfm-ts-api';
import { getPlexMatch } from 'queries';
import React from 'react';
import { FiRadio } from 'react-icons/fi';
import { ImLastfm } from 'react-icons/im';
import { IoMdMicrophone } from 'react-icons/io';
import { PiWaveform } from 'react-icons/pi';
import { persistedStore, store } from 'state';
import { QueryKeys } from 'typescript';

const ReactiveChip = reactive(Chip);

const NowPlayingSimilar: React.FC = observer(function NowPlayingSimilar() {
  const nowPlaying = store.audio.nowPlaying.get();
  const active = store.ui.nowPlaying.activeTab.get();

  const { data } = useQuery({
    queryKey: ['track-radio', nowPlaying.track.id],
    queryFn: () => nowPlaying.track.getTrackRadio(nowPlaying.track.id),
    enabled: active === 2,
  });

  const { data: lastfmSimilarTracks } = useQuery({
    queryKey: [QueryKeys.LASTFM_SIMILAR, nowPlaying.track.id],
    queryFn: async () => {
      const lastfmTrack = new LastFMTrack(persistedStore.lastfmApiKey.peek());
      return lastfmTrack.getSimilar({
        artist:
          nowPlaying.track.grandparentTitle === 'Various Artists'
            ? nowPlaying.track.originalTitle
            : nowPlaying.track.grandparentTitle,
        track: nowPlaying.track.title,
        autocorrect: 1,
      });
    },
  });

  const { data: matchedPlexTracks } = useQuery({
    queryKey: ['lastfm-matched-tracks', nowPlaying.track.id],
    queryFn: async () => {
      const matchedTracks = [] as Track[];
      await Promise.all(
        lastfmSimilarTracks!.similartracks.track.map(async (track) => {
          const match = await getPlexMatch({ artist: track.artist.name, title: track.name });
          if (match) {
            matchedTracks.push({ ...match, score: track.match as unknown as number });
          }
        })
      );
      return matchedTracks.sort((a, b) => b.score! - a.score!);
    },
    enabled: !!lastfmSimilarTracks && active === 3,
    staleTime: Infinity,
  });

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
      label: 'Track Radio',
      icon: <FiRadio />,
    },
    {
      label: 'last.fm Similar',
      icon: <ImLastfm />,
    },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="-webkit-fill-available"
      margin={2}
      width="calc(100% - 80px)"
    >
      <Scroller style={{ height: '-webkit-fill-available', marginBottom: 8 }}>
        <Box bgcolor="orchid" height={1000} />
      </Scroller>
      <Box display="flex" gap={1} justifyContent="center" width={1}>
        {chips.map((value, index) => (
          <ReactiveChip
            key={value.label}
            startDecorator={value.icon}
            sx={{
              fontWeight:
                active === index ? 'var(--joy-fontWeight-xl)' : 'var(--joy-fontWeight-md)',
              maxWidth: 256,
            }}
            variant="plain"
            onClick={() => store.ui.nowPlaying.activeTab.set(index)}
          >
            {value.label}
          </ReactiveChip>
        ))}
      </Box>
    </Box>
  );
});

export default NowPlayingSimilar;
