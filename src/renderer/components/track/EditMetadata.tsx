import { Box, Chip, InputAdornment, TextField, TextFieldProps, Typography } from '@mui/material';
import { Track } from 'api';
import TrackRating from 'components/rating/TrackRating';
import React from 'react';
import { BiLockAlt, BiLockOpenAlt } from 'react-icons/bi';

const EditMetadataInput: React.FC<{
  divProps?: React.HTMLAttributes<HTMLDivElement>;
  field: keyof Track;
  label: string;
  textFieldProps?: TextFieldProps;
  track: Track;
}> = ({ divProps, field, label, textFieldProps, track }) => {
  const isLocked = track.fields.find((value) => value.name === field);

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
        value={(track[field] as string | number) || ''}
        variant="standard"
        {...textFieldProps}
      />
    </div>
  );
};

const EditMetadata: React.FC<{ track: Track }> = ({ track }) => {
  const handleDelete = () => console.log('delete');

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="-webkit-fill-available"
      padding={2}
      paddingBottom={2}
      width={1}
    >
      <Typography paddingBottom={1} variant="h4">
        Edit Track
      </Typography>
      <Box display="flex">
        <Box display="flex" flex="1 0 0" flexDirection="column" gap={0.5}>
          <EditMetadataInput field="grandparentTitle" label="Album Artist" track={track} />
          <EditMetadataInput
            field="originalTitle"
            label="Track Artist"
            textFieldProps={{ placeholder: 'Edit track artist' }}
            track={track}
          />
          <EditMetadataInput field="parentTitle" label="Album" track={track} />
          <EditMetadataInput field="title" label="Title" track={track} />
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
                <TrackRating id={track.id} userRating={track.userRating / 2 || 0} />
              </div>
            </div>
            <EditMetadataInput
              divProps={{ style: { flex: '1 0 0', width: 0 } }}
              field="index"
              label="Track &#x2116;"
              textFieldProps={{
                sx: {
                  background: 'transparent',
                  left: '-0.5rem',
                },
              }}
              track={track}
            />
            <EditMetadataInput
              divProps={{ style: { flex: '1 0 0', width: 0 } }}
              field="parentIndex"
              label="Disc &#x2116;"
              textFieldProps={{
                sx: {
                  background: 'transparent',
                  left: '-0.5rem',
                },
              }}
              track={track}
            />
          </div>
        </Box>
        <span style={{ height: '100%', width: 16 }} />
        <Box display="flex" flex="1 0 0" flexDirection="column">
          <Typography color="text.secondary" lineHeight={1} marginBottom={0.25} variant="subtitle2">
            Genres
          </Typography>
          <Box
            display="flex"
            flexWrap="wrap"
            gap={0.5}
            marginTop={0.5}
            position="relative"
            width={1}
          >
            {track.genres.map((genre) => (
              <Chip key={genre.id} label={genre.tag} size="small" onDelete={handleDelete} />
            ))}
          </Box>
          <Typography
            color="text.secondary"
            lineHeight={1}
            marginBottom={0.25}
            marginTop={1}
            variant="subtitle2"
          >
            Moods
          </Typography>
          <Box
            display="flex"
            flexWrap="wrap"
            gap={0.5}
            marginTop={0.5}
            position="relative"
            width={1}
          >
            {track.moods.map((mood) => (
              <Chip key={mood.id} label={mood.tag} size="small" onDelete={handleDelete} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditMetadata;
