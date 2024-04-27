import { observer } from '@legendapp/state/react';
import {
  Box,
  Chip,
  InputAdornment,
  SvgIcon,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { Track } from 'api';
import TrackRating from 'components/rating/TrackRating';
import React from 'react';
import { BiLockAlt, BiLockOpenAlt } from 'react-icons/bi';
import { TbEdit } from 'react-icons/tb';
import { store } from 'state';

const MetadataEditInput: React.FC<{
  divProps?: React.HTMLAttributes<HTMLDivElement>;
  field: keyof Track;
  textFieldProps?: TextFieldProps;
  label: string;
}> = ({ divProps, field, textFieldProps, label }) => {
  const nowPlaying = store.audio.nowPlaying.get();
  const isLocked = nowPlaying.track.fields.find((value) => value.name === field);

  return (
    <div {...divProps}>
      <Typography color="text.secondary" lineHeight={1} marginBottom={0.25} variant="subtitle2">
        {label}
      </Typography>
      <TextField
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              {isLocked ? <BiLockAlt /> : <BiLockOpenAlt />}
            </InputAdornment>
          ),
        }}
        sx={{
          left: '-0.5rem',
          width: 'calc(100% + 1rem)',
        }}
        value={(nowPlaying.track[field] as string | number) || ''}
        variant="standard"
        {...textFieldProps}
      />
    </div>
  );
};

const NowPlayingMetadata: React.FC = observer(function NowPlayingMetadata() {
  const nowPlaying = store.audio.nowPlaying.get();

  const handleDelete = () => console.log('delete');

  return (
    <Box alignItems="flex-start" display="flex" height={1} width="calc(100% - 64px)">
      <Box display="flex" flex="1 0 0" flexDirection="column" gap={0.5} maxWidth={400} padding={2}>
        <MetadataEditInput field="grandparentTitle" label="Album Artist" />
        <MetadataEditInput
          field="originalTitle"
          label="Track Artist"
          textFieldProps={{ placeholder: 'Edit track artist' }}
        />
        <MetadataEditInput field="parentTitle" label="Album" />
        <MetadataEditInput field="title" label="Title" />
        <div style={{ display: 'flex', gap: 8, width: 'calc(100% + 1rem)' }}>
          <div style={{ flex: '1 0 0', width: 0 }}>
            <Typography
              color="text.secondary"
              lineHeight={1}
              marginBottom={0.25}
              variant="subtitle2"
            >
              Rating
            </Typography>
            <div style={{ alignItems: 'center', display: 'flex', height: 32 }}>
              <TrackRating id={nowPlaying.track.id} userRating={nowPlaying.track.userRating} />
            </div>
          </div>
          <MetadataEditInput
            divProps={{ style: { flex: '1 0 0', width: 0 } }}
            field="index"
            label="Track &#x2116;"
            textFieldProps={{
              sx: {
                background: 'transparent',
                left: '-0.5rem',
              },
            }}
          />
          <MetadataEditInput
            divProps={{ style: { flex: '1 0 0', width: 0 } }}
            field="parentIndex"
            label="Disc &#x2116;"
            textFieldProps={{
              sx: {
                background: 'transparent',
                left: '-0.5rem',
              },
            }}
          />
        </div>
      </Box>
      <Box display="flex" flex="1 0 0" flexDirection="column" padding={2}>
        <Box display="flex" height={14} marginBottom={0.25}>
          <Typography color="text.secondary" lineHeight={1} variant="subtitle2">
            Genres
          </Typography>
          <SvgIcon
            sx={(theme) => ({
              marginLeft: 'auto',
              width: 20,
              height: 20,
              top: -3,
              position: 'relative',
              '&:hover': { color: theme.palette.action.hover },
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
            <Chip key={genre.id} label={genre.tag} size="small" onDelete={handleDelete} />
          ))}
        </Box>
        <Typography
          color="text.secondary"
          lineHeight={1}
          marginBottom={0.25}
          marginTop={1.5}
          variant="subtitle2"
        >
          Moods
        </Typography>
        <TextField
          placeholder="Add a mood"
          sx={{
            left: '-0.5rem',
            width: 'calc(100% + 1rem)',
          }}
          variant="standard"
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
            <Chip key={mood.id} label={mood.tag} size="small" onDelete={handleDelete} />
          ))}
        </Box>
      </Box>
    </Box>
  );
});

export default NowPlayingMetadata;
