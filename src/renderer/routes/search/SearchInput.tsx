import { observer, reactive, useObserve } from '@legendapp/state/react';
import { IconButton, InputAdornment, InputBase, Paper, SvgIcon } from '@mui/material';
import { useDebouncedCallback } from '@react-hookz/web';
import React, { useRef } from 'react';
import { CgSearch } from 'react-icons/cg';
import { MdClear } from 'react-icons/md';
import { Form, useSearchParams, useSubmit } from 'react-router-dom';
import { store } from 'state';

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  'value'
)?.set;

const ReactiveInputBase = reactive(InputBase);

const SearchInput: React.FC = observer(function SearchInput() {
  const searchForm = useRef<HTMLFormElement | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  const [params] = useSearchParams();
  const submit = useSubmit();

  useObserve(store.ui.search.input, () => {
    const input = document.getElementById('search-input') as HTMLInputElement;
    if (input) {
      searchForm.current = input.form;
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
    if (
      searchForm.current &&
      event.target.value.length > 1 &&
      event.target.value !== params.get('query')
    ) {
      debouncedSubmit();
    }
  };

  const handleClear = () => {
    store.ui.search.input.set('');
    const input = document.getElementById('search-input') as HTMLInputElement;
    nativeInputValueSetter?.call(input, '');
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
    input.focus();
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <Paper elevation={2} sx={{ alignItems: 'center', display: 'flex', flexShrink: 0, height: 40 }}>
      <Form action="/search" style={{ width: '100%' }} onSubmit={(event) => event.preventDefault()}>
        <ReactiveInputBase
          fullWidth
          $endAdornment={
            store.ui.search.input.get().length > 0 ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear}>
                  <MdClear />
                </IconButton>
              </InputAdornment>
            ) : null
          }
          $startAdornment={
            <InputAdornment position="start">
              <IconButton onClick={() => searchInput.current?.focus()}>
                <SvgIcon sx={{ height: 20, width: 20 }} viewBox="2 0 24 24">
                  <CgSearch />
                </SvgIcon>
              </IconButton>
            </InputAdornment>
          }
          autoComplete="off"
          id="search-input"
          inputProps={{
            maxLength: 128,
            spellCheck: false,
            sx: {
              fontWeight: 500,
              padding: '2px 0 3px',
              '&::placeholder': {
                opacity: 0.75,
              },
            },
          }}
          inputRef={searchInput}
          name="query"
          placeholder="Search"
          value={store.ui.search.input.get()}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </Form>
    </Paper>
  );
});

export default SearchInput;
