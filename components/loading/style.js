import styled, { keyframes } from 'styled-components'

export const Wrapper = styled.div`
  visibility: ${props => props.visible ? 'visible' : 'hidden' };
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

export const LoadingWrapper = styled.div`
  position: fixed;
  left: ${props => props.left + 'px'};
  top: ${props => props.top + 'px'};
  border-radius: 2px;
  z-index: 1000;
  transform-origin: center center;
`

export const Icon = styled.svg`
  width: 30px;
  height: 30px;
  animation: ${rotate} 2s linear infinite;
`