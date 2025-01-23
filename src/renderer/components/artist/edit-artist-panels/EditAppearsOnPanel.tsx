import { useObservable, useSelector } from '@legendapp/state/react';
import { Avatar, Box, IconButton, SvgIcon, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Album, Artist, Track } from 'api';
import EditFab from 'components/edit/EditFab';
import Scroller from 'components/scroller/Scroller';
import { useImageResize } from 'hooks/useImageResize';
import { isEmpty, isEqual } from 'lodash';
import { useAlbumsArtistAppearsOn } from 'queries';
import React, { useRef } from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { PiEye, PiEyeSlash } from 'react-icons/pi';
import { useSearchParams } from 'react-router-dom';
import { persistedStore } from 'state';
import { CustomFilterKeys } from 'typescript';

const TrackRow: React.FC<{
  artistGuid: string;
  toggleVisibility: (track: Track) => void;
  track: Track;
}> = ({ artistGuid, toggleVisibility, track }) => {
  const isHidden = useSelector(() => {
    const artistHasFilters = persistedStore.appearsOnFilters[artistGuid].get();
    if (!artistHasFilters) return false;
    return !!artistHasFilters.exclusions.find((trackGuid) => trackGuid === track.guid);
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
  artistGuid: string;
  toggleVisibility: (track: Track) => void;
}> = ({ album, artistGuid, toggleVisibility }) => {
  const thumbSrc = useImageResize(
    new URLSearchParams({
      url: album.thumb,
      width: '64',
      height: '64',
    })
  );

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
          artistGuid={artistGuid}
          key={track.id}
          toggleVisibility={toggleVisibility}
          track={track}
        />
      ))}
    </Box>
  );
};

const EditAppearsOnPanel: React.FC<{ artist: Artist }> = ({ artist }) => {
  const artistFilters = useRef(persistedStore.appearsOnFilters[artist.guid].peek());
  const isModified = useObservable(false);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: appearsOn } = useAlbumsArtistAppearsOn(artist.guid, artist.id, artist.title, false);

  const handleSave = async () => {
    isModified.set(false);
    const modifiedFilters = persistedStore.appearsOnFilters[artist.guid].peek();
    artistFilters.current = modifiedFilters;
    const tracks = appearsOn!.flatMap((album) => album.tracks);
    const allHidden = tracks.every((track) => {
      if (!modifiedFilters) return false;
      return modifiedFilters.exclusions.includes(track.guid);
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
    const artistHasFilters = persistedStore.appearsOnFilters[artist.guid].peek();
    if (!artistHasFilters) {
      persistedStore.appearsOnFilters[artist.guid].set({
        exclusions: [track.guid],
        inclusions: [],
      });
    }
    if (artistHasFilters) {
      const isHidden = artistHasFilters.exclusions.find((exclusion) => exclusion === track.guid);
      if (isHidden) {
        persistedStore.appearsOnFilters[artist.guid].set((prev) => ({
          ...prev,
          exclusions: [...prev.exclusions.filter((exclusion) => exclusion !== track.guid)],
        }));
      }
      if (!isHidden) {
        persistedStore.appearsOnFilters[artist.guid].set((prev) => ({
          ...prev,
          exclusions: [...prev.exclusions, track.guid],
        }));
      }
      const updatedArtistFilters = persistedStore.appearsOnFilters[artist.guid].peek();
      if (isEmpty(updatedArtistFilters.exclusions) && isEmpty(updatedArtistFilters.inclusions)) {
        persistedStore.appearsOnFilters[artist.guid].delete();
      }
    }
    if (isEqual(artistFilters.current, persistedStore.appearsOnFilters[artist.guid].peek())) {
      isModified.set(false);
    } else {
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
