import {
  Box,
  Checkbox,
  Fab,
  FormControlLabel,
  FormHelperText,
  InputBase,
  SvgIcon,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Track } from 'api';
import Scroller from 'components/scroller/Scroller';
import { inPlaceSort } from 'fast-sort';
import { db } from 'features/db';
import { motion } from 'framer-motion';
import { useLyrics } from 'queries';
import React, { useMemo, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { PiCheckCircleFill } from 'react-icons/pi';
import { store } from 'state';
import { QueryKeys } from 'typescript';

const buttonMotion = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
    y: -16,
  },
  hidden: {
    opacity: 0,
    y: -4,
  },
};

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

const MotionFab = motion(Fab);

const EditLyricsPanel: React.FC<{ track: Track }> = ({ track }) => {
  const queryClient = useQueryClient();
  const { data: lyrics } = useLyrics(track);
  const [instrumental, setInstrumental] = useState(lyrics?.instrumental);
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
      setLyricsEdited(true);
      return;
    }
    if (!event.target.checked) {
      setValue(lyrics?.syncedLyrics || lyrics?.plainLyrics || '');
      setLyricsEdited(false);
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
                setLyricsEdited(true);
                if (
                  event.target.value === lyrics?.syncedLyrics ||
                  event.target.value === lyrics?.plainLyrics
                ) {
                  setLyricsEdited(false);
                }
              }}
            />
          </Box>
        </Scroller>
      </Box>
      <FormHelperText sx={sx}>{text}</FormHelperText>
      <motion.div
        animate={lyricsEdited ? 'visible' : 'hidden'}
        initial="hidden"
        style={{
          bottom: 0,
          right: 16,
          position: 'absolute',
        }}
        variants={buttonMotion}
      >
        <MotionFab
          size="small"
          sx={(theme) => ({
            backgroundColor: theme.palette.background.default,
            '&:hover': {
              backgroundColor: theme.palette.background.default,
            },
          })}
          whileHover={{ scale: 1.1 }}
          onClick={handleSave}
        >
          <SvgIcon sx={(theme) => ({ color: theme.palette.primary.main, height: 42, width: 42 })}>
            <PiCheckCircleFill />
          </SvgIcon>
        </MotionFab>
      </motion.div>
    </Box>
  );
};

export default EditLyricsPanel;
