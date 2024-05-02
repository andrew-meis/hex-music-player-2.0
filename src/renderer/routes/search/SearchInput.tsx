import { Memo, useObserve } from '@legendapp/state/react';
import { IconButton, InputBase, Paper, SvgIcon, useColorScheme } from '@mui/material';
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

  const { mode } = useColorScheme();

  useObserve(store.ui.search.input, () => {
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
    store.ui.search.input.set(event.target.value);
    searchForm.current = event.currentTarget.form;
    if (event.target.value.length === 0) {
      submit(searchForm.current);
    }
    if (searchForm.current && event.target.value.length > 1 && event.target.value !== query) {
      debouncedSubmit();
    }
  };

  const handleClear = () => {
    store.ui.search.input.set('');
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
    <Paper
      component={Form}
      elevation={mode === 'dark' ? 8 : 2}
      sx={{ alignItems: 'center', display: 'flex', height: 40 }}
      onSubmit={(event) => event.preventDefault()}
    >
      <Memo>
        {() => {
          const value = store.ui.search.input.get();
          return (
            <>
              <IconButton
                sx={{ height: 40, width: 40 }}
                onClick={() => searchInput.current?.focus()}
              >
                <SvgIcon
                  sx={{ height: 20, transform: 'rotate(90deg)', width: 20 }}
                  viewBox="2 0 24 24"
                >
                  <CgSearch />
                </SvgIcon>
              </IconButton>
              <InputBase
                fullWidth
                autoComplete="off"
                id="search-input"
                inputProps={{ maxLength: 128, spellCheck: false, style: { padding: '2px 0 3px' } }}
                inputRef={searchInput}
                name="query"
                placeholder="Search"
                value={value}
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
              />
              {value.length !== 0 && (
                <IconButton sx={{ height: 40, width: 40 }} onClick={handleClear}>
                  <SvgIcon>
                    <MdClear />
                  </SvgIcon>
                </IconButton>
              )}
            </>
          );
        }}
      </Memo>
    </Paper>
  );
};

export default SearchInput;
