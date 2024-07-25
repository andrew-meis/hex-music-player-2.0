import { Box, InputAdornment, TextField, TextFieldProps, Typography } from '@mui/material';
import { Track } from 'api';
import Rating from 'components/rating/Rating';
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

const EditGeneralPanel: React.FC<{ track: Track }> = ({ track }) => {
  return (
    <Box
      display="flex"
      flex="1 0 0"
      flexDirection="column"
      gap={1}
      height={1}
      left="0.5rem"
      paddingTop={2}
      position="relative"
      width="calc(100% - 1rem)"
    >
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
          <Typography color="text.secondary" lineHeight={1} marginBottom={0.25} variant="subtitle2">
            Rating
          </Typography>
          <div style={{ alignItems: 'center', display: 'flex', height: 32 }}>
            <Rating id={track.id} userRating={track.userRating / 2 || 0} />
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
  );
};

export default EditGeneralPanel;
