import { observer } from '@legendapp/state/react';
import {
  Box,
  Chip,
  ChipDelete,
  Input,
  InputProps,
  SvgIcon,
  Typography,
  useColorScheme,
} from '@mui/joy';
import { Track } from 'api';
import TrackRating from 'components/rating/TrackRating';
import React from 'react';
import { BiLockAlt, BiLockOpenAlt } from 'react-icons/bi';
import { TbEdit } from 'react-icons/tb';
import { store } from 'state';

const MetadataEditInput: React.FC<{
  divProps?: React.HTMLAttributes<HTMLDivElement>;
  field: keyof Track;
  inputProps?: InputProps;
  label: string;
}> = ({ divProps, field, inputProps, label }) => {
  const nowPlaying = store.audio.nowPlaying.get();
  const isLocked = nowPlaying.track.fields.find((value) => value.name === field);

  const { mode } = useColorScheme();

  return (
    <div {...divProps}>
      <Typography level="body-sm" lineHeight={1} marginBottom={0.25}>
        {label}
      </Typography>
      <Input
        endDecorator={isLocked ? <BiLockAlt /> : <BiLockOpenAlt />}
        sx={{
          '--Input-minHeight': '2rem',
          '--Input-paddingInline': '0.5rem',
          background: 'transparent',
          left: '-0.5rem',
          width: 'calc(100% + 1rem)',
          '&:hover': {
            background: `rgba(21, 21, 21, ${mode === 'dark' ? '0.35' : '0.08'})`,
          },
        }}
        value={(nowPlaying.track[field] as string | number) || ''}
        variant="plain"
        {...inputProps}
      />
    </div>
  );
};

const NowPlayingMetadata: React.FC = observer(function NowPlayingMetadata() {
  const library = store.library.get();
  const nowPlaying = store.audio.nowPlaying.get();

  const { mode } = useColorScheme();

  return (
    <Box alignItems="flex-start" display="flex" height={1} width="calc(100% - 64px)">
      <Box display="flex" flex="1 0 0" flexDirection="column" gap={0.5} maxWidth={400} padding={2}>
        <MetadataEditInput field="grandparentTitle" label="Album Artist" />
        <MetadataEditInput
          field="originalTitle"
          inputProps={{ placeholder: 'Edit track artist' }}
          label="Track Artist"
        />
        <MetadataEditInput field="parentTitle" label="Album" />
        <MetadataEditInput field="title" label="Title" />
        <div style={{ display: 'flex', gap: 8, width: 'calc(100% + 1rem)' }}>
          <div style={{ flex: '1 0 0', width: 0 }}>
            <Typography level="body-sm" lineHeight={1} marginBottom={0.25}>
              Rating
            </Typography>
            <div style={{ alignItems: 'center', display: 'flex', height: 32 }}>
              <TrackRating
                id={nowPlaying.track.id}
                library={library}
                userRating={nowPlaying.track.userRating}
              />
            </div>
          </div>
          <MetadataEditInput
            divProps={{ style: { flex: '1 0 0', width: 0 } }}
            field="index"
            inputProps={{
              sx: {
                '--Input-minHeight': '2rem',
                '--Input-paddingInline': '0.5rem',
                background: 'transparent',
                left: '-0.5rem',
                '&:hover': {
                  background: `rgba(21, 21, 21, ${mode === 'dark' ? '0.35' : '0.08'})`,
                },
              },
            }}
            label="Track &#x2116;"
          />
          <MetadataEditInput
            divProps={{ style: { flex: '1 0 0', width: 0 } }}
            field="parentIndex"
            inputProps={{
              sx: {
                '--Input-minHeight': '2rem',
                '--Input-paddingInline': '0.5rem',
                background: 'transparent',
                left: '-0.5rem',
                '&:hover': {
                  background: `rgba(21, 21, 21, ${mode === 'dark' ? '0.35' : '0.08'})`,
                },
              },
            }}
            label="Disc &#x2116;"
          />
        </div>
      </Box>
      <Box display="flex" flex="1 0 0" flexDirection="column" padding={2}>
        <Box display="flex" height={14} marginBottom={0.25}>
          <Typography level="body-sm" lineHeight={1}>
            Genres
          </Typography>
          <SvgIcon
            sx={(theme) => ({
              marginLeft: 'auto',
              width: 20,
              height: 20,
              top: -3,
              position: 'relative',
              '&:hover': { color: theme.palette.neutral.plainHoverColor },
            })}
          >
            <TbEdit />
          </SvgIcon>
        </Box>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={0.5}
          left="-0.5rem"
          marginTop={0.5}
          position="relative"
          width="calc(100% + 1rem)"
        >
          {nowPlaying.track.genres.map((genre) => (
            <Chip endDecorator={<ChipDelete />} key={genre.id} variant="plain">
              {genre.tag}
            </Chip>
          ))}
        </Box>
        <Typography level="body-sm" lineHeight={1} marginBottom={0.25} marginTop={1.5}>
          Moods
        </Typography>
        <Input
          placeholder="Add a mood"
          sx={{
            '--Input-minHeight': '2rem',
            '--Input-paddingInline': '0.5rem',
            background: 'transparent',
            left: '-0.5rem',
            width: 'calc(100% + 1rem)',
            '&:hover': {
              background: `rgba(21, 21, 21, ${mode === 'dark' ? '0.35' : '0.08'})`,
            },
          }}
          variant="plain"
        />
        <Box
          display="flex"
          flexWrap="wrap"
          gap={0.5}
          left="-0.5rem"
          marginTop={0.5}
          position="relative"
          width="calc(100% + 1rem)"
        >
          {nowPlaying.track.moods.map((mood) => (
            <Chip endDecorator={<ChipDelete />} key={mood.id} variant="plain">
              {mood.tag}
            </Chip>
          ))}
        </Box>
      </Box>
    </Box>
  );
});

export default NowPlayingMetadata;
