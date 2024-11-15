import { useObservable } from '@legendapp/state/react';
import { Box, Checkbox, FormControlLabel, FormHelperText, InputBase } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Track } from 'api';
import EditFab from 'components/edit/EditFab';
import Scroller from 'components/scroller/Scroller';
import { inPlaceSort } from 'fast-sort';
import { db } from 'features/db';
import { useLyrics } from 'queries';
import React, { useMemo, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { store } from 'state';
import { QueryKeys } from 'typescript';

const processLyrics = (lyrics: string) => {
  let lines = lyrics.split(/\r?\n/);
  const regex = /(\[\d\d:\d\d.\d\d\])/g;
  lines = lines.flatMap((line) => {
    const lineSplit = line.split(regex);
    const timestamps = lineSplit.filter((str) => str.match(/(\[\d\d:\d\d.\d\d\])/));
    const lyric = lineSplit
      .filter((str) => !str.match(/(\[\d\d:\d\d.\d\d\])/))
      .filter((str) => str);
    return timestamps.map((timestamp) => `${timestamp} ${lyric}`);
  });
  return inPlaceSort(lines).asc().join('\n');
};

const EditLyricsPanel: React.FC<{ track: Track }> = ({ track }) => {
  const queryClient = useQueryClient();
  const isModified = useObservable(false);
  const { data: lyrics } = useLyrics(track);
  const [instrumental, setInstrumental] = useState(lyrics?.instrumental);
  const [value, setValue] = useState(lyrics?.syncedLyrics || lyrics?.plainLyrics || '');

  const validSyncedLyrics = useMemo(
    () => value?.split(/\r?\n/).every((line) => line.split(/\[\d\d:\d\d.\d\d\]/).length === 2),
    [value]
  );

  const validPlainLyrics = useMemo(() => typeof value === 'string', [value]);

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: { '*': ['.*'] },
    noClick: true,
    onDrop: (files: FileWithPath[]) => {
      if (files.length === 0) {
        return;
      }
      if (!['.lrc', '.txt'].includes(files[0].name.slice(-4))) {
        store.ui.toasts.set((prev) => [
          ...prev,
          { message: 'Must upload .txt or .lrc file', key: new Date().getTime() },
        ]);
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        const newLyrics = processLyrics(event.target!.result as string);
        setValue(newLyrics);
        isModified.set(true);
      });
      reader.readAsText(files[0]);
    },
  });

  const style = useMemo(
    () => ({
      borderWidth: '1px',
      borderStyle: 'dashed',
      borderColor: isDragAccept
        ? 'var(--mui-palette-success-main)'
        : 'var(--mui-palette-action-disabled)',
    }),
    [isDragAccept]
  );

  const sx = useMemo(
    () => ({
      fontSize: '0.8rem',
      margin: 0,
      position: 'relative',
      ...(validSyncedLyrics && { color: 'success.main' }),
      ...(!validSyncedLyrics && validPlainLyrics && { color: 'warning.main' }),
    }),
    [validPlainLyrics, validSyncedLyrics]
  );

  const text = useMemo(() => {
    if (validSyncedLyrics) return 'Valid synced lyrics';
    if (!validSyncedLyrics && validPlainLyrics) return 'Valid plain lyrics';
    if (!value) return ' ';
    return ' ';
  }, [validPlainLyrics, validSyncedLyrics, value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInstrumental(event.target.checked);
    if (event.target.checked) {
      setValue('');
      isModified.set(true);
      return;
    }
    if (!event.target.checked) {
      setValue(lyrics?.syncedLyrics || lyrics?.plainLyrics || '');
      isModified.set(false);
    }
  };

  const handleSave = async () => {
    const lyricsRecord = await db.lyrics
      .where('artistGuid')
      .equals(track.grandparentGuid)
      .and((lyrics) => lyrics.trackGuid === track.guid)
      .first();
    if (!lyricsRecord || !lyrics) return;
    const newLyrics = {
      ...lyrics,
      instrumental: instrumental,
      ...(validSyncedLyrics && { syncedLyrics: value }),
      ...(!validSyncedLyrics && validPlainLyrics && { plainLyrics: value || null }),
    };
    await db.lyrics.update(lyricsRecord.id, newLyrics);
    queryClient.refetchQueries({ queryKey: [QueryKeys.LYRICS, track.id] });
    store.ui.modals.open.set(false);
  };

  return (
    <Box display="flex" flexDirection="column" height={1} width={1}>
      <FormControlLabel
        control={<Checkbox checked={instrumental} onChange={handleChange} />}
        label="Instrumental track"
        sx={{
          margin: 0,
        }}
      />
      <Box
        {...getRootProps({ style })}
        bgcolor="background.default"
        border="1px solid var(--mui-palette-action-disabled)"
        borderRadius={1}
        flexGrow={1}
        height={224}
      >
        <Scroller style={{ height: '100%' }}>
          <Box overflow="auto">
            <InputBase
              fullWidth
              multiline
              disabled={instrumental}
              inputProps={{
                ...getInputProps(),
                style: {
                  padding: '0 5px',
                },
              }}
              minRows={9}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                isModified.set(true);
                if (
                  event.target.value === lyrics?.syncedLyrics ||
                  event.target.value === lyrics?.plainLyrics
                ) {
                  isModified.set(false);
                }
              }}
            />
          </Box>
        </Scroller>
      </Box>
      <FormHelperText sx={sx}>{text}</FormHelperText>
      <EditFab isVisible={isModified} onClick={handleSave} />
    </Box>
  );
};

export default EditLyricsPanel;
