import { observer } from '@legendapp/state/react';
import { Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { store } from 'state';

const Toasts: React.FC = observer(function Toasts() {
  const toasts = store.ui.toasts.get();
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<{ key: number; message: string } | undefined>(
    undefined
  );

  useEffect(() => {
    if (toasts.length && !messageInfo) {
      setMessageInfo({ ...toasts[0] });
      store.ui.toasts.set((prev) => prev.slice(1));
      setOpen(true);
    } else if (toasts.length && messageInfo && open) {
      setOpen(false);
    }
  }, [toasts, messageInfo, open]);

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <Snackbar
      disableWindowBlurListener
      TransitionProps={{ onExited: handleExited }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      autoHideDuration={2000}
      key={messageInfo ? messageInfo.key : undefined}
      message={messageInfo ? messageInfo.message : undefined}
      open={open}
      onClose={handleClose}
    />
  );
});

export default Toasts;
