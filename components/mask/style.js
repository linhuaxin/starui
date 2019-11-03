import styled from 'styled-components'

export const Mask = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: ${ props => props.showBg ? 'rgba(0.4,0,0,0.45);' : ''}
  filter: alpha(opacity=50);
`