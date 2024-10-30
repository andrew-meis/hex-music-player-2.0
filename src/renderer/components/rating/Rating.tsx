import { SvgIcon } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import useMouseLeave from 'hooks/useMouseLeave';
import { invalidateTrackQueries } from 'queries';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BsDot, BsStarFill } from 'react-icons/bs';
import { store } from 'state';

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

  const calculateRating = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { width, left } = innerRef.current!.getBoundingClientRect();
      const percent = (e.clientX - left) / width;
      const numberInStars = percent * totalStars;
      const nearestNumber = Math.round((numberInStars + precision / 2) / precision) * precision;

      return Number(nearestNumber.toFixed(precision.toString().split('.')[1]?.length || 0));
    },
    [innerRef, precision, totalStars]
  );

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
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
    },
    [calculateRating, id, library, queryClient, userRating]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (mouseLeft) return;
      setIsHovered(true);
      setHoverActiveStar(calculateRating(e));
    },
    [calculateRating, mouseLeft]
  );

  const stars = useMemo(() => {
    return [...new Array(totalStars)].map((_array, index) => {
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
    });
  }, [hoverActiveStar, isHovered, totalStars, userRating]);

  return (
    <div
      className="rating-container"
      ref={setRef}
      style={{ flexShrink: 0 }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {stars}
    </div>
  );
};

export default React.memo(Rating);
