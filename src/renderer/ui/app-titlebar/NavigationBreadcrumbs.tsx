import { observer } from '@legendapp/state/react';
import { Breadcrumbs, Typography } from '@mui/material';
import { isEqual, last } from 'lodash';
import React from 'react';
import emoji from 'react-easy-emoji';
import { Link } from 'react-router-dom';
import { store } from 'state';

const NavigationBreadcrumbs: React.FC = observer(function NavigationBreadcrumbs() {
  const breadcrumbs = store.ui.breadcrumbs.get();

  return (
    <Breadcrumbs
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexShrink: 0,
        fontWeight: 400,
        marginLeft: 1,
        marginRight: 'auto',
        maxWidth: 'calc(100% - 424px)',
      }}
    >
      {breadcrumbs.map((value, index, array) => {
        if (isEqual(value, last(array))) {
          return (
            <Typography fontSize="inherit" fontWeight="inherit" key={index} lineHeight="inherit">
              {emoji(value.title)}
            </Typography>
          );
        }
        return (
          <Link className="link" key={index} to={value.to}>
            {emoji(value.title)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
});

export default NavigationBreadcrumbs;
