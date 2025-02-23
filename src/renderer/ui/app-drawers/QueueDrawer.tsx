import { observer, reactive, Show, useMount } from '@legendapp/state/react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, ClickAwayListener, Drawer, Tab, Typography } from '@mui/material';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { PlayQueueItem } from 'api';
import BackToRow from 'components/queue/BackToRow';
import { queueColumns } from 'components/queue/columns';
import UpNextRow from 'components/queue/UpNextRow';
import Scroller from 'components/virtuoso/Scroller';
import { selectActions } from 'features/select';
import React, { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { ItemProps, TableProps, TableVirtuoso } from 'react-virtuoso';
import { allSelectObservables, store } from 'state';
import { DragTypes, SelectObservables } from 'typescript';

const ReactiveDrawer = reactive(Drawer);

const BackTo: React.FC<{ backTo: PlayQueueItem[] }> = ({ backTo }) => {
  const selectObservable = allSelectObservables[SelectObservables.DRAWER_QUEUE];
  const columns = useMemo(() => queueColumns, []);
  const table = useReactTable({
    data: backTo,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  return (
    <ClickAwayListener
      onClickAway={(event) => selectActions.handleClickAway(selectObservable, event)}
    >
      <TableVirtuoso
        components={{
          Scroller,
          Table: ({ style, ...props }: TableProps) => (
            <table
              {...props}
              style={{
                ...style,
                width: '-webkit-fill-available',
                tableLayout: 'fixed',
              }}
            />
          ),
          TableRow: (props: ItemProps<PlayQueueItem>) => {
            const index = props['data-index'];
            const row = rows[index];

            return (
              <BackToRow index={index} state={selectObservable} {...props}>
                {row.getVisibleCells().map((cell) => (
                  <td className={cell.column.id} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </BackToRow>
            );
          },
        }}
        isScrolling={handleScrollState}
        style={{ height: 'calc(100% - 8px)', marginTop: 8 }}
        totalCount={rows.length}
        onMouseOver={() => {
          store.ui.menus.activeMenu.set(SelectObservables.DRAWER_QUEUE);
          selectObservable.items.set(backTo);
        }}
      />
    </ClickAwayListener>
  );
};

const UpNext: React.FC<{ upNext: PlayQueueItem[] }> = ({ upNext }) => {
  const selectObservable = allSelectObservables[SelectObservables.DRAWER_QUEUE];

  const columns = useMemo(() => queueColumns, []);
  const table = useReactTable({
    data: upNext,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  return (
    <ClickAwayListener
      onClickAway={(event) => selectActions.handleClickAway(selectObservable, event)}
    >
      <TableVirtuoso
        components={{
          Scroller,
          Table: ({ style, ...props }: TableProps) => (
            <table
              {...props}
              style={{
                ...style,
                width: '-webkit-fill-available',
                tableLayout: 'fixed',
              }}
            />
          ),
          TableRow: (props: ItemProps<PlayQueueItem>) => {
            const index = props['data-index'];
            const row = rows[index];

            return (
              <UpNextRow
                index={index}
                lastIndex={rows.length - 1}
                state={selectObservable}
                {...props}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className={cell.column.id} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </UpNextRow>
            );
          },
        }}
        isScrolling={handleScrollState}
        style={{ height: 'calc(100% - 8px)', marginTop: 8 }}
        totalCount={rows.length}
        onMouseOver={() => {
          store.ui.menus.activeMenu.set(SelectObservables.DRAWER_QUEUE);
          selectObservable.items.set(upNext);
        }}
      />
    </ClickAwayListener>
  );
};

const QueueTabs: React.FC = () => {
  const [{ canDrop }, drop] = useDrop(
    () => ({
      accept: [DragTypes.PLAYQUEUE_ITEM],
      drop: (item) => console.log(item),
      collect: (monitor) => ({
        canDrop: monitor.canDrop() && store.ui.queue.activeTab.peek() !== '0',
      }),
    }),
    []
  );

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    store.ui.queue.activeTab.set(newValue);
  };

  return (
    <TabList onChange={handleChange}>
      <Tab
        label={
          <Typography paddingTop={0.25} variant="subtitle1">
            Up Next
          </Typography>
        }
        ref={drop}
        sx={{
          outline: canDrop ? '2px solid var(--mui-palette-primary-main)' : '',
        }}
        value="0"
        onDragEnter={() => setTimeout(() => store.ui.queue.activeTab.set('0'), 500)}
      />
      <Tab
        label={
          <Typography paddingTop={0.25} variant="subtitle1">
            Back To
          </Typography>
        }
        value="1"
      />
    </TabList>
  );
};

const Queue: React.FC = observer(function Queue() {
  const activeTab = store.ui.queue.activeTab.get();

  useMount(() => {
    store.ui.queue.activeTab.set('0');
  });

  return (
    <Show ifReady={store.queue.currentQueue.items}>
      {() => {
        const queue = store.queue.currentQueue.get();
        const currentIndex = store.queue.currentIndex.get();
        const backTo = queue.items.slice(0, currentIndex).reverse();
        const upNext = queue.items.slice(currentIndex + 1);
        return (
          <TabContext value={activeTab}>
            <QueueTabs />
            <TabPanel sx={{ height: '-webkit-fill-available', padding: 0, width: 1 }} value="0">
              <UpNext upNext={upNext} />
            </TabPanel>
            <TabPanel sx={{ height: '-webkit-fill-available', padding: 0, width: 1 }} value="1">
              <BackTo backTo={backTo} />
            </TabPanel>
          </TabContext>
        );
      }}
    </Show>
  );
});

const QueueDrawer: React.FC = () => {
  const handleClose = (event: MouseEvent | TouchEvent) => {
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-invisible')) {
      return;
    }
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-root')) {
      store.ui.drawers.queue.open.set(false);
    }
  };

  return (
    <ReactiveDrawer $open={() => store.ui.drawers.queue.open.get()} anchor="right">
      <ClickAwayListener onClickAway={handleClose}>
        <Box display="flex" flexDirection="column" height={1}>
          <Typography paddingX={1} variant="h5">
            Queue
          </Typography>
          <Queue />
        </Box>
      </ClickAwayListener>
    </ReactiveDrawer>
  );
};

export default QueueDrawer;
