import { Avatar } from '@mui/material';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { BsMusicNote, BsMusicNoteList } from 'react-icons/bs';
import { FaTags } from 'react-icons/fa';
import { IoMdMicrophone } from 'react-icons/io';
import { LuLayoutGrid } from 'react-icons/lu';
import { store } from 'state';

const icons = {
  album: <BiSolidAlbum />,
  artist: <IoMdMicrophone />,
  collection: <LuLayoutGrid />,
  genre: <FaTags />,
  playlist: <BsMusicNoteList />,
  track: <BsMusicNote />,
};

interface Variants {
  [key: string]: 'rounded' | 'circular' | 'square';
}

const variants: Variants = {
  album: 'rounded',
  artist: 'circular',
  collection: 'rounded',
  genre: 'rounded',
  playlist: 'rounded',
  track: 'rounded',
};

const Thumb: React.FC<{
  title: string;
  type: keyof typeof icons;
  url: string | undefined;
}> = ({ title, type, url }) => {
  const library = store.library.peek();
  const thumbSrc = url
    ? library.resizeImage(new URLSearchParams({ url, width: '64', height: '64' }))
    : undefined;

  return (
    <Avatar alt={title} src={thumbSrc} sx={{ height: 48, width: 48 }} variant={variants[type]}>
      {icons[type]}
    </Avatar>
  );
};

export default Thumb;
