import React, { useRef, createElement } from 'react';
import { styled } from "@mui/material";
import Slider from 'react-slick';
import CarouselControlArrows from './CarouselControlArrows';
import { ICampaign } from '../../utils/interfaces';

/* -------------------------------------------------------------- */

interface IProps {
  data: Array<ICampaign> | Array<string>;
  slideSettings: object;
  carouselItemComponent: React.ComponentType<{ key: number, dataItem: any }>;
  arrowsVisible: boolean;
}

/* -------------------------------------------------------------- */

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative'
}));

/* -------------------------------------------------------------- */

export default function Carousel({ data, slideSettings, carouselItemComponent, arrowsVisible = true }: IProps) {
  const carouselRef = useRef<Slider>(null);

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <RootStyle>
      <Slider ref={carouselRef} {...slideSettings}>
        {data.map((dataItem, index) => (
          createElement(carouselItemComponent, {
            key: index,
            dataItem
          })
        ))}
      </Slider>
      {
        arrowsVisible && (<CarouselControlArrows onNext={handleNext} onPrevious={handlePrevious} />)
      }
    </RootStyle>
  );
}