import { ObservableArray } from '@legendapp/state';
import { useMount, useObservable, useSelector } from '@legendapp/state/react';
import { Avatar, Box, IconButton, SvgIcon, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Album, Artist, Track } from 'api';
import EditFab from 'components/edit/EditFab';
import Scroller from 'components/scroller/Scroller';
import { isEqual } from 'lodash';
import { useAlbumsArtistAppearsOn } from 'queries';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { PiEye, PiEyeSlash } from 'react-icons/pi';
import { useSearchParams } from 'react-router-dom';
import { store } from 'state';
import { AppearsOnFilters, CustomFilterKeys } from 'typescript';

const TrackRow: React.FC<{
  artistGuid: string;
  appearsOnFilters: ObservableArray<AppearsOnFilters>;
  toggleVisibility: (track: Track) => void;
  track: Track;
}> = ({ appearsOnFilters, artistGuid, toggleVisibility, track }) => {
  const isHidden = useSelector(() => {
    const filters = appearsOnFilters.get();
    if (!filters) return false;
    const [isFiltered] = filters.filter((filter) => filter.artistGuid === artistGuid);
    if (!isFiltered) return false;
    return !!isFiltered.exclusions.find((trackGuid) => trackGuid === track.guid);
  });

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

const AlbumRow: React.FC<{
  album: Album;
  appearsOnFilters: ObservableArray<AppearsOnFilters>;
  artistGuid: string;
  toggleVisibility: (track: Track) => void;
}> = ({ album, appearsOnFilters, artistGuid, toggleVisibility }) => {
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

  return (
    <Box marginBottom={2}>
      <Box alignItems="center" display="flex" height={64}>
        <Avatar
          alt={album.title}
          src={thumbSrc}
          sx={{ aspectRatio: 1, height: 48, margin: 1, width: 48 }}
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
          appearsOnFilters={appearsOnFilters}
          artistGuid={artistGuid}
          key={track.id}
          toggleVisibility={toggleVisibility}
          track={track}
        />
      ))}
    </Box>
  );
};

const filters = await window.api.getValue('appears-on-filters');

const EditAppearsOnPanel: React.FC<{ artist: Artist }> = ({ artist }) => {
  const appearsOnFilters = useObservable(filters);
  const isModified = useObservable(false);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: appearsOn } = useAlbumsArtistAppearsOn(artist.guid, artist.id, artist.title, false);

  useMount(async () => {
    const updatedFilters = await window.api.getValue('appears-on-filters');
    appearsOnFilters.set(updatedFilters);
  });

  const handleSave = async () => {
    isModified.set(false);
    await window.api.setValue('appears-on-filters', appearsOnFilters.peek());
    const tracks = appearsOn!.flatMap((album) => album.tracks);
    const allHidden = tracks.every((track) => {
      return appearsOnFilters
        .peek()
        .find((filter) => filter.artistGuid === artist.guid)
        ?.exclusions.includes(track.guid);
    });
    if (allHidden && searchParams.get('tabIndex') === '8') {
      searchParams.set('tabIndex', '0');
      setSearchParams(searchParams);
    }
    await queryClient.refetchQueries({
      predicate: (query) =>
        Object.values(CustomFilterKeys).includes(query.queryKey[0] as CustomFilterKeys),
    });
  };

  const toggleVisibility = async (track: Track) => {
    let updatedAppearsOnFilters = structuredClone(appearsOnFilters.peek());
    if (!updatedAppearsOnFilters) {
      updatedAppearsOnFilters = [
        { artistGuid: artist.guid, exclusions: [track.guid], inclusions: [] },
      ];
      return;
    } else {
      const artistIndex = updatedAppearsOnFilters.findIndex(
        (filter) => filter.artistGuid === artist.guid
      );
      if (artistIndex > -1) {
        const isHidden = updatedAppearsOnFilters[artistIndex].exclusions.find(
          (exclusion) => exclusion === track.guid
        );
        if (!isHidden) {
          const updatedExclusions = [
            ...updatedAppearsOnFilters[artistIndex].exclusions,
            track.guid,
          ];
          updatedAppearsOnFilters[artistIndex].exclusions = updatedExclusions;
        }
        if (isHidden) {
          const updatedExclusions = updatedAppearsOnFilters[artistIndex].exclusions.filter(
            (trackGuid) => trackGuid !== track.guid
          );
          updatedAppearsOnFilters[artistIndex].exclusions = updatedExclusions;
        }
      }
      if (artistIndex === -1) {
        updatedAppearsOnFilters.push({
          artistGuid: artist.guid,
          exclusions: [track.guid],
          inclusions: [],
        });
      }
    }
    appearsOnFilters.set(updatedAppearsOnFilters);
    const savedAppearsOnFilters = await window.api.getValue('appears-on-filters');
    if (isEqual(savedAppearsOnFilters, updatedAppearsOnFilters)) {
      isModified.set(false);
    }
    if (!isEqual(savedAppearsOnFilters, updatedAppearsOnFilters)) {
      isModified.set(true);
    }
  };

  if (!appearsOn) return null;

  return (
    <>
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
          {appearsOn?.map((album) => (
            <AlbumRow
              album={album}
              appearsOnFilters={appearsOnFilters}
              artistGuid={artist.guid}
              key={album.id}
              toggleVisibility={toggleVisibility}
            />
          ))}
        </Scroller>
      </Box>
      <EditFab isVisible={isModified} onClick={handleSave} />
    </>
  );
};

export default EditAppearsOnPanel;
