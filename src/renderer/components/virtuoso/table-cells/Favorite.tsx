import { observer } from '@legendapp/state/react';
import { IconButton, IconButtonProps } from '@mui/material';
import { DateTime, Duration } from 'luxon';
import React from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';
import { persistedStore } from 'state';

export const isInLast = (date: DateTime, duration: Duration) => {
  const now = DateTime.now();
  const start = now.minus(duration);
  if (date < now && date > start) return true;
  return false;
};

export const shouldUpdateFavorite = (lastPlayed: Date | undefined, timestamp: number) => {
  const date = DateTime.fromSeconds(timestamp);
  if (!isInLast(date, Duration.fromObject({ weeks: 4 }))) {
    if (!lastPlayed) {
      return true;
    } else if (!isInLast(DateTime.fromJSDate(lastPlayed), Duration.fromObject({ weeks: 4 }))) {
      return true;
    }
  }
  return false;
};

export const updateFavorite = (id: number, lastPlayed: Date | undefined, timestamp: number) => {
  const shouldUpdate = shouldUpdateFavorite(lastPlayed, timestamp);
  if (shouldUpdate) persistedStore.currentFavorites[id].delete();
};

const Favorite: React.FC<{ id: number; lastViewedAt?: Date } & Omit<IconButtonProps, 'id'>> =
  observer(function Favorite({ id, lastViewedAt, ...props }) {
    const isFavorite = persistedStore.currentFavorites[id].get();
    if (isFavorite) updateFavorite(id, lastViewedAt, isFavorite);

    const handleClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      if (isFavorite) {
        persistedStore.currentFavorites[id].delete();
        return;
      }
      persistedStore.currentFavorites[id].set(DateTime.now().toUnixInteger());
    };

    return (
      <IconButton
        data-is-favorite={!!isFavorite}
        sx={{ height: 30, width: 30 }}
        onClick={handleClick}
        {...props}
      >
        {isFavorite ? <HiHeart /> : <HiOutlineHeart />}
      </IconButton>
    );
  });

export default Favorite;
