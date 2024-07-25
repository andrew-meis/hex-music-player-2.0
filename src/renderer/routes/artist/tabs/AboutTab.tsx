import { Show } from '@legendapp/state/react';
import { Box, SvgIcon, Tooltip, Typography } from '@mui/material';
import { Artist, SORT_ARTISTS_BY_PLAYS } from 'api';
import { Color } from 'chroma-js';
import { flag } from 'country-emoji';
import Konva from 'konva';
import { isEmpty } from 'lodash';
import { useArtists } from 'queries';
import React, { useCallback, useEffect, useState } from 'react';
import emoji from 'react-easy-emoji';
import { TbPlus } from 'react-icons/tb';
import { Layer, Stage, Star, Text } from 'react-konva';
import { store } from 'state';

const countryMap = (country: string) => {
  switch (country) {
    case 'Republic of Korea':
      return 'South Korea';
    default:
      return country;
  }
};

const AboutTab: React.FC<{ artist: Artist; color: Color }> = ({ artist, color }) => {
  const [primaryTextDimensions, setPrimaryTextDimensions] = useState<{
    height: number;
    width: number;
  } | null>(null);
  const primaryRef = useCallback((node: Konva.Text) => {
    if (node !== null) {
      setPrimaryTextDimensions({ height: node.height(), width: node.width() });
    }
  }, []);

  const [secondaryTextDimensions, setSecondaryTextDimensions] = useState<{
    height: number;
    width: number;
  } | null>(null);
  const secondaryRef = useCallback((node: Konva.Text) => {
    if (node !== null) {
      setSecondaryTextDimensions({ height: node.height(), width: node.width() });
    }
  }, []);

  const { data: topArtists, isLoading } = useArtists(
    new URLSearchParams({
      limit: '250',
      sort: SORT_ARTISTS_BY_PLAYS.desc,
    })
  );

  useEffect(() => {
    if (store.ui.modals.open.peek()) {
      store.ui.modals.values.artist.set(artist);
    }
  }, [artist]);

  const index = topArtists?.artists.findIndex((value) => value.id === artist.id);

  if (!topArtists || isLoading) return <Box display="flex" minHeight="var(--content-height)" />;

  return (
    <Box display="flex" minHeight="var(--content-height)">
      <Show if={typeof index === 'number' && index > -1}>
        <Box height="auto" width={200}>
          <Stage height={200} width={200}>
            <Layer>
              <Star
                fill={color.set('lab.l', '75').hex()}
                innerRadius={64}
                numPoints={18}
                outerRadius={72}
                x={96}
                y={96}
              />
              <Text
                fontFamily="TT Commons"
                fontSize={32}
                fontVariant="bold"
                offsetX={(primaryTextDimensions?.width || 0) / 2}
                offsetY={(primaryTextDimensions?.height || 0) / 2}
                ref={primaryRef}
                text={`#${index! + 1}`}
                x={94}
                y={90}
              />
              <Text
                fontFamily="TT Commons"
                fontSize={14}
                offsetX={(secondaryTextDimensions?.width || 0) / 2}
                offsetY={(secondaryTextDimensions?.height || 0) / 2}
                ref={secondaryRef}
                text="in your library"
                x={96}
                y={112}
              />
            </Layer>
          </Stage>
        </Box>
      </Show>
      <Box height="auto" padding={3} width={1}>
        <Box
          alignItems="center"
          display="flex"
          height={36}
          justifyContent="flex-start"
          paddingBottom={1}
        >
          {!isEmpty(artist.country) && (
            <>
              {artist.country.map((country) => (
                <Tooltip
                  arrow
                  key={country.id}
                  placement="right"
                  title={
                    <Typography color="text.primary" variant="subtitle2">
                      {country.tag}
                    </Typography>
                  }
                >
                  <Box display="flex" fontSize="2.5rem" width="min-content">
                    {emoji(flag(countryMap(country.tag)))}
                  </Box>
                </Tooltip>
              ))}
              <Typography flexShrink={0} mx="8px">
                ┊
              </Typography>
            </>
          )}
          {isEmpty(artist.country) && (
            <>
              <Box
                alignItems="center"
                border="1px dashed var(--mui-palette-grey-500)"
                borderRadius={1}
                boxSizing="border-box"
                color="var(--mui-palette-grey-500)"
                display="flex"
                height={30}
                justifyContent="center"
                sx={{
                  cursor: 'pointer',
                }}
                width={40}
                onClick={() => store.ui.modals.values.artist.set(artist)}
              >
                <SvgIcon color="inherit" sx={{ height: 22, width: 22 }}>
                  <TbPlus />
                </SvgIcon>
              </Box>
              <Typography flexShrink={0} mx="8px">
                ┊
              </Typography>
            </>
          )}
          {artist.viewCount > 0 && (
            <Typography textAlign="right">
              {artist.viewCount} {artist.viewCount === 1 ? 'play' : 'plays'}
            </Typography>
          )}
          {!artist.viewCount && <Typography textAlign="right">unplayed</Typography>}
        </Box>
        <Typography>{artist.summary}</Typography>
      </Box>
    </Box>
  );
};

export default AboutTab;
