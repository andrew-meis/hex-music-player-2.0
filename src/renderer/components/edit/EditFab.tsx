import { Observable, ObservableComputed } from '@legendapp/state';
import { reactive } from '@legendapp/state/react';
import { Fab, FabProps, SvgIcon } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { PiCheckBold } from 'react-icons/pi';

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

const ReactiveMotionDiv = reactive(motion.div);
const MotionFab = motion(Fab);

const EditFab: React.FC<{
  isVisible: Observable<boolean> | ObservableComputed<boolean>;
  onClick: FabProps['onClick'];
}> = ({ isVisible, onClick }) => {
  return (
    <ReactiveMotionDiv
      $animate={() => (isVisible.get() ? 'visible' : 'hidden')}
      initial="hidden"
      style={{
        bottom: 0,
        right: 16,
        position: 'absolute',
        zIndex: 20,
      }}
      variants={buttonMotion}
    >
      <MotionFab
        size="small"
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          height: 42,
          width: 42,
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
          },
        })}
        whileHover={{ scale: 1.1 }}
        onClick={onClick}
      >
        <SvgIcon
          sx={(theme) => ({
            color: theme.palette.background.default,
          })}
        >
          <PiCheckBold />
        </SvgIcon>
      </MotionFab>
    </ReactiveMotionDiv>
  );
};

export default EditFab;
