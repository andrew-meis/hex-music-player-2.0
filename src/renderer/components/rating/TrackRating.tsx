import { SvgIcon } from '@mui/material';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import useMouseLeave from 'hooks/useMouseLeave';
import React, { useEffect, useState } from 'react';
import { BsDot, BsStarFill } from 'react-icons/bs';
import { store } from 'state';
import { QueryKeys } from 'typescript';

const invalidateTrackQueries = async (queryClient: QueryClient) =>
  await queryClient.invalidateQueries({
    predicate: (query) =>
      [QueryKeys.ALBUM_TRACKS, QueryKeys.PLAYQUEUE].includes(query.queryKey[0] as QueryKeys),
  });

const Rating: React.FC<
  {
    id: number;
    userRating: number;
  } & Omit<React.HTMLProps<HTMLDivElement>, 'id'>
> = ({ id, userRating, ...props }) => {
  const library = store.library.peek();
  const precision = 0.5;
  const totalStars = 5;
  const queryClient = useQueryClient();
  const [hoverActiveStar, setHoverActiveStar] = useState(-1);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseLeft, setRef, innerRef] = useMouseLeave();

  useEffect(() => {
    if (mouseLeft) {
      setHoverActiveStar(-1);
      setIsHovered(false);
    }
  }, [mouseLeft]);

  const calculateRating = (e: React.MouseEvent<HTMLDivElement>) => {
    const { width, left } = innerRef.current!.getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    const numberInStars = percent * totalStars;
    const nearestNumber = Math.round((numberInStars + precision / 2) / precision) * precision;

    return Number(nearestNumber.toFixed(precision.toString().split('.')[1]?.length || 0));
  };

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsHovered(false);
    const newRating = calculateRating(e);
    if (newRating === userRating) {
      await library.rate(id, -1);
      await invalidateTrackQueries(queryClient);
      return;
    }
    await library.rate(id, newRating * 2);
    await invalidateTrackQueries(queryClient);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    setHoverActiveStar(calculateRating(e));
  };

  return (
    <div
      className="rating-container"
      ref={setRef}
      style={{ flexShrink: 0 }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {[...new Array(totalStars)].map((_array, index) => {
        const activeState = isHovered ? hoverActiveStar : userRating;

        const showEmptyIcon = activeState === -1 || activeState < index + 1;

        const isActiveRating = activeState !== 1;
        const isRatingWithPrecision = activeState % 1 !== 0;
        const isRatingEqualToIndex = Math.ceil(activeState) === index + 1;
        const showRatingWithPrecision =
          isActiveRating && isRatingWithPrecision && isRatingEqualToIndex;

        return (
          <div
            className="rating-star"
            key={index}
            style={{
              cursor: 'pointer',
              margin: '0 1px',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: showRatingWithPrecision ? `${(activeState % 1) * 100}%` : '0%',
                overflow: 'hidden',
                position: 'absolute',
              }}
            >
              <SvgIcon color="inherit" sx={{ width: 13, height: 20 }}>
                <BsStarFill />
              </SvgIcon>
            </div>
            <div
              style={{
                color: showEmptyIcon ? 'gray' : 'inherit',
              }}
            >
              <SvgIcon color="inherit" sx={{ width: 13, height: 20 }}>
                {showEmptyIcon ? <BsDot /> : <BsStarFill />}
              </SvgIcon>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(Rating);
