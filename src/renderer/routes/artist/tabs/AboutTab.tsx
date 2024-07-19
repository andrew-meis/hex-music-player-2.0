import { Show } from '@legendapp/state/react';
import { Box, Typography } from '@mui/material';
import { Artist, SORT_ARTISTS_BY_PLAYS } from 'api';
import { Color } from 'chroma-js';
import Konva from 'konva';
import { useArtists } from 'queries';
import React, { useCallback, useState } from 'react';
import { Layer, Stage, Star, Text } from 'react-konva';

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

  const index = topArtists?.artists.findIndex((value) => value.id === artist.id);

  if (!topArtists || isLoading) return null;

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
        <Typography>{artist.summary}</Typography>
      </Box>
    </Box>
  );
};

export default AboutTab;
