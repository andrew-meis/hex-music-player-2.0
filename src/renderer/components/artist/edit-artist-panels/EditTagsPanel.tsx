import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  Box,
  capitalize,
  Chip,
  InputAdornment,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
  UseAutocompleteProps,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Artist, Country } from 'api';
import ListboxScroller from 'components/scroller/ListboxScroller';
import { invalidateArtistQueries, useCountries } from 'queries';
import React from 'react';
import { BiLockAlt, BiLockOpenAlt } from 'react-icons/bi';
import { store } from 'state';

const tagNameMap = {
  country: 'country',
};

const TagAutocomplete: React.FC<{
  artist: Artist;
  options: Country[] | undefined;
  tag: 'country';
  onChange: UseAutocompleteProps<string, true, true, true>['onChange'];
}> = ({ artist, options, tag, onChange }) => {
  const isLocked = artist.fields.find((value) => value.name === tagNameMap[tag]);

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
            placeholder={artist[tag].length > 0 ? undefined : `Add ${tag}`}
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
        value={artist[tag].map((value) => value.tag)}
        onChange={onChange}
      />
    </div>
  );
};

const EditTagsPanel: React.FC<{ artist: Artist }> = ({ artist }) => {
  const queryClient = useQueryClient();
  const { data: countries } = useCountries();

  const handleCountriesChange = async (
    _event: React.SyntheticEvent,
    _value: string[],
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string> | undefined
  ) => {
    const { sectionId } = store.serverConfig.peek();
    const library = store.library.peek();
    if (reason === 'createOption' && details?.option !== undefined) {
      await library.modifyArtistCountry(sectionId, artist.id, [details.option]);
    }
    if (reason === 'selectOption' && details?.option !== undefined) {
      await library.modifyArtistCountry(sectionId, artist.id, [details.option]);
    }
    if (reason === 'removeOption' && details?.option !== undefined) {
      await library.modifyArtistCountry(sectionId, artist.id, undefined, [details.option]);
    }
    invalidateArtistQueries(queryClient);
  };

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
      <TagAutocomplete
        artist={artist}
        options={countries}
        tag="country"
        onChange={handleCountriesChange}
      />
    </Box>
  );
};

export default EditTagsPanel;
