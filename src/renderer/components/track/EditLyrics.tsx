import { Box, Button, FormHelperText, InputBase, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Track } from 'api';
import { db } from 'app/db';
import Scroller from 'components/scroller/Scroller';
import { inPlaceSort } from 'fast-sort';
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

const EditLyrics: React.FC<{ track: Track }> = ({ track }) => {
  const queryClient = useQueryClient();
  const { data: lyrics } = useLyrics(track);
  const [lyricsEdited, setLyricsEdited] = useState(false);
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
        // setToast({ type: 'error', text: 'Must upload .txt or .lrc file' });
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        const newLyrics = processLyrics(event.target!.result as string);
        setValue(newLyrics);
        setLyricsEdited(true);
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
      position: 'relative',
      top: -4,
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

  const handleSave = async () => {
    const lyricsRecord = await db.lyrics
      .where('artistGuid')
      .equals(track.grandparentGuid)
      .and((lyrics) => lyrics.trackGuid === track.guid)
      .first();
    if (!lyricsRecord) return;
    const newLyrics = {
      ...lyrics,
      ...(validSyncedLyrics && { syncedLyrics: value }),
      ...(!validSyncedLyrics && validPlainLyrics && { plainLyrics: value }),
    };
    await db.lyrics.update(lyricsRecord.id, newLyrics);
    queryClient.refetchQueries({ queryKey: [QueryKeys.LYRICS, track.id] });
    store.ui.modals.editLyrics.set(undefined);
  };

  return (
    <>
      <Typography variant="h4">Edit Lyrics</Typography>
      <Box
        {...getRootProps({ style })}
        border="1px solid var(--mui-palette-action-disabled)"
        borderRadius={1}
        height={256}
      >
        <Scroller style={{ height: 256 }}>
          <Box bgcolor="background.default" overflow="auto">
            <InputBase
              fullWidth
              multiline
              inputProps={{
                ...getInputProps(),
                style: {
                  padding: '0 5px',
                },
              }}
              minRows={10}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setLyricsEdited(true);
              }}
            />
          </Box>
        </Scroller>
      </Box>
      <FormHelperText sx={sx}>{text}</FormHelperText>
      <Box bottom={13} display="flex" gap={0.5} position="absolute" right={20}>
        <Button
          color="error"
          disabled={!lyricsEdited}
          size="small"
          variant="contained"
          onClick={() => store.ui.modals.editLyrics.set(undefined)}
        >
          Cancel
        </Button>
        <Button
          color="success"
          disabled={!lyricsEdited}
          size="small"
          variant="contained"
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>
    </>
  );
};

export default EditLyrics;
