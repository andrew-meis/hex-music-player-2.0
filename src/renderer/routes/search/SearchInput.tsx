import { Memo, Show, useObserve } from '@legendapp/state/react';
import { IconButton, Input, Sheet, SvgIcon } from '@mui/joy';
import { useDebouncedCallback } from '@react-hookz/web';
import React, { useRef } from 'react';
import { CgSearch } from 'react-icons/cg';
import { MdClear } from 'react-icons/md';
import { Form, useSubmit } from 'react-router-dom';
import { store } from 'state';

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  'value'
)?.set;

const SearchInput: React.FC<{ query: string }> = ({ query }) => {
  const searchForm = useRef<HTMLFormElement | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const submit = useSubmit();

  useObserve(() => {
    store.searchInput.get();
    const searchInputElement = document.getElementById('search-input') as HTMLInputElement;
    if (searchInputElement) {
      searchForm.current = searchInputElement.form;
    }
  });

  const debouncedSubmit = useDebouncedCallback(
    () => {
      submit(searchForm.current);
    },
    [],
    500
  );

  const handleBlur = () => {
    const selection = document.getSelection();
    if (selection) {
      selection.empty();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    store.searchInput.set(event.target.value);
    searchForm.current = event.currentTarget.form;
    if (event.target.value.length === 0) {
      submit(searchForm.current);
    }
    if (searchForm.current && event.target.value.length > 1 && event.target.value !== query) {
      debouncedSubmit();
    }
  };

  const handleClear = () => {
    store.searchInput.set('');
    if (searchInput.current) {
      nativeInputValueSetter?.call(searchInput.current, '');
      const inputEvent = new Event('input', { bubbles: true });
      searchInput.current.dispatchEvent(inputEvent);
      searchInput.current.focus();
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <Sheet
      component={Form}
      sx={{ alignItems: 'center', borderRadius: 8, display: 'flex', height: 40 }}
      onSubmit={(event) => event.preventDefault()}
    >
      <Memo>
        {() => {
          const value = store.searchInput.get();
          return (
            <Input
              fullWidth
              autoComplete="off"
              endDecorator={
                <Show if={value.length !== 0}>
                  <IconButton size="sm" sx={{ margin: 0.5 }} onClick={handleClear}>
                    <SvgIcon viewBox="-1 0 20 20">
                      <MdClear />
                    </SvgIcon>
                  </IconButton>
                </Show>
              }
              id="search-input"
              name="query"
              placeholder="Search"
              slotProps={{
                input: { maxLength: 128, spellCheck: false, ref: searchInput },
              }}
              startDecorator={
                <IconButton
                  size="sm"
                  sx={{ margin: 0.5 }}
                  onClick={() => searchInput.current?.focus()}
                >
                  <SvgIcon
                    sx={{ height: 20, transform: 'rotate(90deg)', width: 20 }}
                    viewBox="1 -1 20 20"
                  >
                    <CgSearch />
                  </SvgIcon>
                </IconButton>
              }
              sx={{
                backgroundColor: 'background.level2',
                '--Input-paddingInline': 0,
              }}
              value={value}
              variant="soft"
              onBlur={handleBlur}
              onChange={handleChange}
              onFocus={handleFocus}
            />
          );
        }}
      </Memo>
    </Sheet>
  );
};

export default SearchInput;
