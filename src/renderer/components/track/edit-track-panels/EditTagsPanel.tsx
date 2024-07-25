import {
  Autocomplete,
  Box,
  Chip,
  InputAdornment,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Genre, MediaType, Mood, Track } from 'api';
import ListboxScroller from 'components/scroller/ListboxScroller';
import { capitalize } from 'lodash';
import { useGenres, useMoods } from 'queries';
import React from 'react';
import { BiLockAlt, BiLockOpenAlt } from 'react-icons/bi';

const tagNameMap = {
  genres: 'genre',
  moods: 'mood',
};

const TagAutocomplete: React.FC<{
  options: (Genre | Mood)[] | undefined;
  tag: 'genres' | 'moods';
  track: Track;
}> = ({ options, tag, track }) => {
  const isLocked = track.fields.find((value) => value.name === tagNameMap[tag]);

  return (
    <div>
      <Typography color="text.secondary" lineHeight={1} marginBottom={0.25} variant="subtitle2">
        {capitalize(tag)}
      </Typography>
      <Autocomplete
        disableClearable
        freeSolo
        multiple
        ListboxComponent={ListboxScroller}
        options={options?.map((value) => value.title) || []}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translate(0, -50%)',
                  }}
                >
                  {isLocked ? <BiLockAlt /> : <BiLockOpenAlt />}
                </InputAdornment>
              ),
            }}
            placeholder={track[tag].length > 0 ? undefined : `Add ${tag}`}
            variant="standard"
          />
        )}
        renderOption={(props, option) => {
          return (
            <MenuItem {...props} key={option}>
              <ListItemText>{option}</ListItemText>
            </MenuItem>
          );
        }}
        renderTags={(tagValue, getTagProps) => {
          return tagValue.map((option, index) => (
            <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
          ));
        }}
        sx={{
          left: '-0.25rem',
          position: 'relative',
          width: 'calc(100% + 0.5rem)',
          '& .MuiInputBase-root': {
            paddingRight: '30px',
          },
        }}
        value={track[tag].map((value) => value.tag)}
      />
    </div>
  );
};

const EditTagsPanel: React.FC<{ track: Track }> = ({ track }) => {
  const { data: genres } = useGenres(MediaType.TRACK);
  const { data: moods } = useMoods(MediaType.TRACK);

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
      <TagAutocomplete options={genres?.genres} tag="genres" track={track} />
      <TagAutocomplete options={moods} tag="moods" track={track} />
    </Box>
  );
};

export default EditTagsPanel;
