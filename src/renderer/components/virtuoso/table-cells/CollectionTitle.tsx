import { Show } from '@legendapp/state/react';
import { Box, Typography } from '@mui/material';
import { Collection } from 'api';
import React from 'react';
import { Link } from 'react-router-dom';
import { createCollectionNavigate } from 'scripts/navigate-generators';

const CollectionTitle: React.FC<{
  showSubtext?: boolean;
  showType?: boolean;
  collection: Collection;
}> = ({ showSubtext = true, showType = false, collection }) => {
  return (
    <Box>
      <Typography variant="title1">
        <Link
          className="link"
          to={createCollectionNavigate(collection)}
          onClick={(event) => event.stopPropagation()}
        >
          {collection.title}
        </Link>
      </Typography>
      <Show if={showSubtext}>
        <Typography variant="title2">
          {showType ? `${collection._type}\xa0 · \xa0` : ''}
          {collection.childCount}
          &nbsp;
          {collection.childCount > 1 || collection.childCount === 0 ? 'items' : 'item'}
        </Typography>
      </Show>
    </Box>
  );
};

export default CollectionTitle;
