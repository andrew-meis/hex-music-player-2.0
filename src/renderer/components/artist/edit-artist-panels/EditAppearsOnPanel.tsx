import { useSelector } from '@legendapp/state/react';
import { Avatar, Box, IconButton, SvgIcon, Typography } from '@mui/material';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { Album, Artist, Track } from 'api';
import Scroller from 'components/scroller/Scroller';
import { useAlbumsArtistAppearsOn } from 'queries';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { PiEye, PiEyeSlash } from 'react-icons/pi';
import { useSearchParams } from 'react-router-dom';
import { store } from 'state';
import { CustomFilterKeys, QueryKeys, ReleaseFilters } from 'typescript';

const TrackRow: React.FC<{
  isHidden: boolean;
  toggleVisibility: (track: Track) => Promise<void>;
  track: Track;
}> = ({ isHidden, toggleVisibility, track }) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      height={48}
      key={track.id}
      paddingX={1}
      sx={{
        borderRadius: 1,
        transition: 'background-color 100ms ease-in-out',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <div>
        <Typography variant="title1">{track.title}</Typography>
        <Typography variant="title2">{track.originalTitle}</Typography>
      </div>
      <IconButton
        sx={{
          marginLeft: 'auto',
          marginRight: 1,
        }}
        onClick={() => toggleVisibility(track)}
      >
        <SvgIcon>{isHidden ? <PiEyeSlash /> : <PiEye />}</SvgIcon>
      </IconButton>
    </Box>
  );
};

const Row: React.FC<{
  album: Album;
  artistGuid: string;
  trackVisibility: {
    id: number;
    hidden: boolean;
  }[];
}> = ({ album, artistGuid, trackVisibility }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const library = store.library.peek();

  const thumbSrc = useSelector(() => {
    return library.resizeImage(
      new URLSearchParams({
        url: album.thumb,
        width: '64',
        height: '64',
      })
    );
  });

  const toggleVisibility = async (track: Track) => {
    const isHidden = trackVisibility.find((value) => value.id === track.id)!.hidden;
    if (!isHidden) {
      const filters = await window.api.getValue('release-filters');
      if (!filters) {
        const newFilters: ReleaseFilters = [{ guid: artistGuid, exclusions: [track.guid] }];
        await window.api.setValue('release-filters', newFilters);
      }
      if (filters) {
        const index = filters.findIndex((value) => value.guid === artistGuid);
        if (index > -1) {
          const updatedExclusions = [...filters[index].exclusions, track.guid];
          filters[index] = { guid: artistGuid, exclusions: updatedExclusions };
        }
        if (index === -1) {
          filters.push({ guid: artistGuid, exclusions: [track.guid] });
        }
        await window.api.setValue('release-filters', filters);
      }
    }
    if (isHidden) {
      const filters = await window.api.getValue('release-filters');
      const index = filters.findIndex((value) => value.guid === artistGuid);
      const updatedExclusions = filters[index].exclusions.filter(
        (trackGuid) => trackGuid !== track.guid
      );
      filters[index] = { guid: artistGuid, exclusions: updatedExclusions };
      await window.api.setValue('release-filters', filters);
    }
    const newTrackVisiblity = structuredClone(trackVisibility);
    newTrackVisiblity.find((value) => value.id === track.id)!.hidden = !isHidden;
    if (
      newTrackVisiblity.every((value) => value.hidden === true) &&
      searchParams.get('tabIndex') === '8'
    ) {
      searchParams.set('tabIndex', '0');
      setSearchParams(searchParams);
    }
    await queryClient.refetchQueries({
      predicate: (query) =>
        Object.values(CustomFilterKeys).includes(query.queryKey[0] as CustomFilterKeys),
    });
  };

  return (
    <Box marginBottom={2}>
      <Box alignItems="center" display="flex" height={64}>
        <Avatar
          alt={album.title}
          src={thumbSrc}
          sx={{ height: 48, marginX: 1, width: 48 }}
          variant="rounded"
        >
          <BiSolidAlbum />
        </Avatar>
        <div>
          <Typography variant="title1">{album.title}</Typography>
          <Typography variant="title2">{album.parentTitle}</Typography>
        </div>
      </Box>
      {album.tracks.map((track) => (
        <TrackRow
          isHidden={trackVisibility.find((value) => value.id === track.id)!.hidden}
          key={track.id}
          toggleVisibility={toggleVisibility}
          track={track}
        />
      ))}
    </Box>
  );
};

const EditAppearsOnPanel: React.FC<{ artist: Artist }> = ({ artist }) => {
  const { data: appearances } = useAlbumsArtistAppearsOn(
    artist.id,
    artist.guid,
    artist.title,
    false
  );

  const { data: trackVisibility } = useQuery({
    queryKey: [QueryKeys.IS_HIDDEN, artist.id],
    queryFn: async () => {
      const tracks = appearances!.flatMap((album) => album.tracks);
      const releaseFilters = await window.api.getValue('release-filters');
      if (!releaseFilters) return tracks.map((track) => ({ id: track.id, hidden: false }));
      const [isFiltered] = releaseFilters.filter((filter) => filter.guid === artist.guid);
      if (!isFiltered) return tracks.map((track) => ({ id: track.id, hidden: false }));
      return tracks.map((track) => {
        if (isFiltered.exclusions.find((exclusion) => exclusion === track.guid)) {
          return { id: track.id, hidden: true };
        } else {
          return { id: track.id, hidden: false };
        }
      });
    },
    enabled: !!appearances,
    placeholderData: keepPreviousData,
  });

  if (!appearances || !trackVisibility) return null;

  return (
    <Box
      display="flex"
      flex="1 0 0"
      flexDirection="column"
      height={1}
      left="0.5rem"
      overflow="hidden"
      paddingTop={2}
      position="relative"
      width="calc(100% - 1rem)"
    >
      <Scroller display="flex" flexDirection="column" height="calc(100% - 16px)">
        {appearances?.map((album) => (
          <Row
            album={album}
            artistGuid={artist.guid}
            key={album.id}
            trackVisibility={trackVisibility}
          />
        ))}
      </Scroller>
    </Box>
  );
};

export default EditAppearsOnPanel;
