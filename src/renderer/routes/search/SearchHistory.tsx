import { For, observer, Show } from '@legendapp/state/react';
import { Box, SvgIcon } from '@mui/joy';
import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { persistedStore } from 'state';

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  'value'
)?.set;

const NoRecentSearches = () => (
  <Box
    alignItems="center"
    color="text.secondary"
    display="flex"
    height={24}
    justifyContent="center"
    padding="4px"
  >
    ...no recent searches...
  </Box>
);

const SearchHistory: React.FC = observer(function SearchHistory() {
  const handleClick = (value: string) => {
    const input = document.getElementById('search-input') as HTMLInputElement;
    nativeInputValueSetter?.call(input, value);
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="fit-content"
      justifyContent="center"
      marginTop={1.5}
    >
      <Show else={<NoRecentSearches />} if={persistedStore.recentSearches.get().length !== 0}>
        <For optimized each={persistedStore.recentSearches}>
          {(item) => {
            const value = item.get()!;
            return (
              <Box
                alignItems="center"
                borderRadius="4px"
                className="box"
                color="text.secondary"
                display="flex"
                height={24}
                padding="4px 8px 4px 12px"
                sx={{
                  '& svg': {
                    display: 'none',
                  },
                  '&:hover': {
                    backgroundColor: 'background.level2',
                    color: 'text.primary',
                    '& svg': {
                      display: 'inherit',
                    },
                  },
                }}
                onClick={() => handleClick(value)}
              >
                {value}
                <SvgIcon
                  sx={{
                    color: 'text.secondary',
                    marginLeft: 'auto',
                    '&:hover': {
                      color: 'text.primary',
                    },
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    persistedStore.recentSearches.set((prev) =>
                      prev.filter((_value) => _value !== value)
                    );
                  }}
                >
                  <IoCloseSharp />
                </SvgIcon>
              </Box>
            );
          }}
        </For>
      </Show>
    </Box>
  );
});

export default SearchHistory;
