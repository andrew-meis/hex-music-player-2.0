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
      <Typography fontFamily="Rubik" lineHeight={1.25} variant="body1">
        <Link
          className="link"
          to={createCollectionNavigate(collection)}
          onClick={(event) => event.stopPropagation()}
        >
          {collection.title}
        </Link>
      </Typography>
      <Show if={showSubtext}>
        <Typography lineHeight={1.25} variant="subtitle1">
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
