import { observer } from '@legendapp/state/react';
import { Breadcrumbs, Typography } from '@mui/material';
import { isEqual, last } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { store } from 'state';

const AppBreadcrumbs: React.FC = observer(function AppBreadcrumbs() {
  const breadcrumbs = store.ui.breadcrumbs.get();
  const handleLinkClick = () => {
    if (store.ui.overlay.peek()) {
      store.ui.overlay.set(false);
    }
  };
  return (
    <Breadcrumbs sx={{ alignItems: 'center', display: 'flex' }}>
      {breadcrumbs.map((value, index, array) => {
        if (isEqual(value, last(array))) {
          return (
            <Typography fontSize="inherit" fontWeight="inherit" key={index}>
              {value.title}
            </Typography>
          );
        }
        return (
          <Link className="link" key={index} to={value.to} onClick={handleLinkClick}>
            {value.title}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
});

export default AppBreadcrumbs;
