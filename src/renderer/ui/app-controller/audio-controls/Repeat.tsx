import { observer, reactive } from '@legendapp/state/react';
import { IconButton, SvgIcon, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { LuDot } from 'react-icons/lu';
import { TbRepeat, TbRepeatOnce } from 'react-icons/tb';
import { store } from 'state';

const ReactiveSvgIcon = reactive(SvgIcon);

const Repeat: React.FC = observer(function Repeat() {
  const repeat = store.audio.repeat.get();

  const handleClick = () => {
    if (repeat === 'none') {
      store.audio.repeat.set('all');
    } else if (repeat === 'all') {
      store.audio.repeat.set('one');
    } else {
      store.audio.repeat.set('none');
    }
  };

  return (
    <Tooltip
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -10],
              },
            },
          ],
        },
      }}
      title={
        <Typography variant="subtitle1">
          {repeat === 'none' && 'Enable repeat'}
          {repeat === 'one' && 'Disable repeat'}
          {repeat === 'all' && 'Enable repeat one'}
        </Typography>
      }
    >
      <IconButton
        color={repeat === 'none' ? 'default' : 'inherit'}
        sx={{
          cursor: 'default',
          padding: 1,
        }}
        onClick={handleClick}
      >
        <SvgIcon sx={{ width: 22, height: 22 }}>
          {repeat === 'none' && <TbRepeat />}
          {repeat === 'one' && <TbRepeatOnce />}
          {repeat === 'all' && <TbRepeat />}
        </SvgIcon>
        <ReactiveSvgIcon
          $sx={() => ({
            width: 22,
            height: 22,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%) translateY(16px)',
            visibility: repeat !== 'none' ? 'visible' : 'hidden',
          })}
        >
          <LuDot />
        </ReactiveSvgIcon>
      </IconButton>
    </Tooltip>
  );
});

export default Repeat;
