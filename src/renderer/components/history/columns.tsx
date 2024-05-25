import { Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { HistoryEntry } from 'api';
import { DateTime } from 'luxon';

const columnHelper = createColumnHelper<HistoryEntry>();

export const historyColumns = [
  columnHelper.accessor('index', {
    cell: (info) => <Typography variant="subtitle2">{info.row.index + 1}.</Typography>,
    header: () => (
      <Typography color="text.secondary" lineHeight="1.5rem" variant="overline">
        №
      </Typography>
    ),
  }),
  columnHelper.accessor('viewedAt', {
    cell: (info) => (
      <Typography variant="subtitle2">
        {DateTime.fromJSDate(info.getValue()).toLocaleString({
          ...DateTime.DATETIME_MED,
          month: 'long',
        })}
      </Typography>
    ),
    header: () => (
      <Typography color="text.secondary" lineHeight="1.5rem" variant="overline">
        Played At
      </Typography>
    ),
  }),
];
