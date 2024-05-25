import { Album, Artist, Playlist, PlaylistItem, PlayQueueItem, Track } from 'api';
import React, { useEffect, useRef } from 'react';
import { useDragLayer, XYCoord } from 'react-dnd';
import { store } from 'state';
import { DragTypes } from 'typescript';

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 10000,
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
};

const getItemStyles = (
  initialCursorOffset: XYCoord | null,
  currentCursorOffset: XYCoord | null,
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) => {
  if (!initialOffset || !currentOffset || !initialCursorOffset || !currentCursorOffset) {
    return {
      display: 'none',
    };
  }

  const translate = Math.floor((currentCursorOffset.x / window.innerWidth) * 100);
  const x = initialCursorOffset.x + (currentOffset.x - initialOffset.x);
  const y = initialCursorOffset.y + (currentOffset.y - initialOffset.y);
  const transform = `translateX(-${translate}%) translate(${x}px, ${y}px)`;

  return {
    transform,
    background: 'var(--mui-palette-background-paper)',
    color: 'var(--mui-palette-text-primary)',
    width: 'fit-content',
    opacity: 0.8,
    lineHeight: '1.5rem',
    borderRadius: '4px',
    padding: '6px',
  };
};

const getText = (item: any, itemType: any) => {
  if (item.length > 1) {
    return `${item.length} items`;
  }
  if (itemType === DragTypes.ALBUM) {
    const [album] = item as Album[];
    return `${album.title} — ${album.parentTitle}`;
  }
  if (itemType === DragTypes.ARTIST) {
    const [artist] = item as Artist[];
    return `${artist.title}`;
  }
  if (
    itemType === DragTypes.PLAYLIST_ITEM ||
    itemType === DragTypes.PLAYQUEUE_ITEM ||
    itemType === DragTypes.SMART_PLAYLIST_ITEM
  ) {
    const [{ track }] = item as PlaylistItem[] | PlayQueueItem[];
    return `${track.title} — ${track.originalTitle || track.grandparentTitle}`;
  }
  if (itemType === DragTypes.TRACK) {
    const [track] = item as Track[];
    return `${track.title} — ${track.originalTitle || track.grandparentTitle}`;
  }
  if (itemType === DragTypes.PLAYLIST) {
    const [playlist] = item as Playlist[];
    return `${playlist.title}`;
  }
  return '';
};

const DragLayer = () => {
  const isDraggingRef = useRef(false);
  const {
    item,
    itemType,
    isDragging,
    initialCursorOffset,
    currentCursorOffset,
    initialFileOffset,
    currentFileOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialCursorOffset: monitor.getInitialClientOffset(),
    currentCursorOffset: monitor.getClientOffset(),
    initialFileOffset: monitor.getInitialSourceClientOffset(),
    currentFileOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  useEffect(() => {
    if (isDragging === isDraggingRef.current) return;
    store.ui.isDragging.set(isDragging);
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  if (!isDragging) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div
        style={getItemStyles(
          initialCursorOffset,
          currentCursorOffset,
          initialFileOffset,
          currentFileOffset
        )}
      >
        <div key={new Date().getTime()}>{getText(item, itemType)}</div>
      </div>
    </div>
  );
};

export default DragLayer;
