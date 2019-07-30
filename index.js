import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Custom Interval hook.
const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => savedCallback.current();

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const Dot = ({
  color,
  radius = 5,
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: radius * 2,
      height: radius * 2,
      backgroundColor: color,
      borderRadius: radius,
      borderStyle: 'none',
    }}
  />
);

Dot.propTypes = {
  color: PropTypes.string,
  radius: PropTypes.number,
};

Dot.defaultProps = {
  color: '#6E6E6E',
  radius: 5,
};

const Carousel = ({
  pages,
  advanceButton = false,
  automatic = false,
  clickable = false,
  finishText = 'finish',
  interval = 1000,
  onFinish = null,
}) => {
  const [index, setIndex] = useState(0);
  const [resetBit, setResetBit] = useState(false);

  const lastPage = pages.length - 1;

  const nextPage = () => {
    if (index < lastPage) {
      return setIndex(index + 1);
    }

    if (onFinish) {
      return onFinish();
    }
    return setIndex(0);
  };

  useInterval(() => {
    if (automatic) nextPage();
  }, resetBit ? null : interval);

  const clickPage = (newIndex) => {
    setIndex(newIndex);
    setResetBit(true);
    setTimeout(() => setResetBit(false), interval);
  };

  return (
    <React.Fragment>
      {pages[index]}
      {advanceButton && <button type="button" onClick={nextPage}>{onFinish && index === lastPage ? finishText : 'next'}</button>}
      <ProgressContainer>
        {pages.map((_, i) => (
          <DotContainer
            onClick={clickable ? () => clickPage(i) : null}
            clickable={clickable}
          >
            <Dot
              radius={5}
              color={index === i ? '#CBCBCB' : '#6E6E6E'}
            />
          </DotContainer>
        ))}
      </ProgressContainer>
    </React.Fragment>
  );
};

Carousel.propTypes = {
  pages: PropTypes.array.isRequired,
  advanceButton: PropTypes.bool,
  automatic: PropTypes.bool,
  clickable: PropTypes.bool,
  finishText: PropTypes.string,
  interval: PropTypes.number,
  onFinish: PropTypes.func,
};

Carousel.defaultProps = {
  advanceButton: false,
  automatic: false,
  clickable: false,
  finishText: 'finish',
  interval: 1000,
  onFinish: null,
};

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 0px;
`;

const DotContainer = styled.div`
  padding: 3px;
  ${props => (props.clickable ? 'cursor: pointer;' : null)}
`;

export default Carousel;
