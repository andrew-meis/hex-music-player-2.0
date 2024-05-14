import { observer } from '@legendapp/state/react';
import { Avatar, Box, SvgIcon, Typography } from '@mui/material';
import { Collection } from 'api';
import Row from 'components/row/Row';
import React from 'react';
import { LuLayoutGrid } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { createCollectionNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

const CollectionRow: React.FC<{ collection: Collection; index: number }> = observer(
  function CollectionRow({ collection, index }) {
    const library = store.library.get();

    const thumbSrc = library.resizeImage(
      new URLSearchParams({
        url: collection.art,
        width: '64',
        height: '64',
      })
    );

    const handleLink = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.stopPropagation();
    };

    return (
      <Row index={index}>
        <Avatar
          alt={collection.title}
          src={thumbSrc}
          sx={{ height: 48, marginX: 1, width: 48 }}
          variant="rounded"
        >
          <SvgIcon>
            <LuLayoutGrid />
          </SvgIcon>
        </Avatar>
        <Box>
          <Typography fontFamily="Rubik" lineHeight={1.2} variant="body1">
            <Link
              className="link"
              to={createCollectionNavigate(collection)}
              onClick={(event) => handleLink(event)}
            >
              {collection.title}
            </Link>
          </Typography>
          <Typography variant="subtitle1">
            {collection.type}
            &nbsp; · &nbsp;
            {collection.childCount}
            &nbsp;
            {collection.childCount > 1 || collection.childCount === 0 ? 'items' : 'item'}
          </Typography>
        </Box>
      </Row>
    );
  }
);

export default CollectionRow;
