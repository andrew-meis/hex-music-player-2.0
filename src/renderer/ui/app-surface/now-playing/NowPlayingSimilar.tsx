import { Memo, observer, useObservable } from '@legendapp/state/react';
import { Box, Chip } from '@mui/joy';
import { useQuery } from '@tanstack/react-query';
import { Track } from 'api';
import { LastFMTrack } from 'lastfm-ts-api';
import { getPlexMatch } from 'queries';
import React from 'react';
import { FiRadio } from 'react-icons/fi';
import { ImLastfm } from 'react-icons/im';
import { IoMdMicrophone } from 'react-icons/io';
import { PiWaveform } from 'react-icons/pi';
import { store } from 'state';
import { QueryKeys } from 'typescript';

const NowPlayingSimilar: React.FC = observer(function NowPlayingSimilar() {
  const nowPlaying = store.audio.nowPlaying.get();
  const active = useObservable(0);

  const { data } = useQuery({
    queryKey: ['track-radio', nowPlaying.track.id],
    queryFn: () => nowPlaying.track.getTrackRadio(nowPlaying.track.id),
    enabled: active.get() === 1,
  });

  console.log(data);

  const { data: lastfmSimilarTracks } = useQuery({
    queryKey: [QueryKeys.LASTFM_SIMILAR, nowPlaying.track.id],
    queryFn: async () => {
      const lastfmTrack = new LastFMTrack('256a87f6eed8560303a6a75b8f5dde83');
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

  console.log(lastfmSimilarTracks);

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
    enabled: !!lastfmSimilarTracks && active.get() === 3,
    staleTime: Infinity,
  });

  return (
    <Box height="-webkit-fill-available" margin={2} marginTop={8} width="-webkit-fill-available">
      <Box height="calc(100% - 32px)" overflow="auto">
        <Box height={1000} />
      </Box>
      <Box display="flex" gap={1} justifyContent="center" width={1}>
        <Memo>
          {() => {
            const nowPlaying = store.audio.nowPlaying.get();
            return (
              <>
                <Chip
                  startDecorator={<IoMdMicrophone />}
                  sx={{
                    fontWeight:
                      active.get() === 0 ? 'var(--joy-fontWeight-xl)' : 'var(--joy-fontWeight-md)',
                    maxWidth: 250,
                  }}
                  onClick={() => active.set(0)}
                >
                  By{' '}
                  {nowPlaying.track.grandparentTitle === 'Various Artists'
                    ? nowPlaying.track.originalTitle
                    : nowPlaying.track.grandparentTitle}
                </Chip>
                <Chip
                  startDecorator={<FiRadio />}
                  sx={{
                    fontWeight:
                      active.get() === 1 ? 'var(--joy-fontWeight-xl)' : 'var(--joy-fontWeight-md)',
                  }}
                  onClick={() => active.set(1)}
                >
                  Track Radio
                </Chip>
                <Chip
                  startDecorator={<PiWaveform />}
                  sx={{
                    fontWeight:
                      active.get() === 2 ? 'var(--joy-fontWeight-xl)' : 'var(--joy-fontWeight-md)',
                  }}
                  onClick={() => active.set(2)}
                >
                  Sonically Similar
                </Chip>
                <Chip
                  startDecorator={<ImLastfm />}
                  sx={{
                    fontWeight:
                      active.get() === 3 ? 'var(--joy-fontWeight-xl)' : 'var(--joy-fontWeight-md)',
                  }}
                  onClick={() => active.set(3)}
                >
                  last.fm Similar
                </Chip>
              </>
            );
          }}
        </Memo>
      </Box>
    </Box>
  );
});

export default NowPlayingSimilar;
