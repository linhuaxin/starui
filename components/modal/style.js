import styled from 'styled-components'

export const Wrapper = styled.div`
  visibility: ${props => props.visible ? 'visible' : 'hidden' }
`

export const Modal = styled.div`
  position: fixed;
  left: ${props => props.left + 'px'};
  top: ${props => props.top + 'px'};
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 1px 1px 50px rgba(0,0,0,.3);
  z-index: 1000;
  min-width: 300px;
  transform-origin: center center;
  
  &.modal-enter {
    transform: scale(0);
  }
  
  &.modal-enter-active {
    transform: scale(1.1);
    transition: all .2s linear;
  }
  
  &.modal-enter-done {
    transform: scale(1);
    transition: all .1s linear;
  }
  
  &.modal-exit {
    transform: scale(1);
  }
  
  &.modal-exit-active {
    transform: scale(1.1);
    transition: all .1s linear;
  }
  
  &.modal-exit-done {
    transform: scale(0);
    transition: all .2s linear;
  }
`

export const Header = styled.div`
  padding: 16px 24px;
  color: rgba(0,0,0,0.65);
  border-bottom: 1px solid #e8e8e8;
`

export const Title = styled.div`
  margin: 0;
  color: rgba(0,0,0,0.85);
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  word-wrap: break-word;
`

export const Content = styled.div`
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
`

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px 16px;
  border-top: 1px solid #e8e8e8;
  
  Button + Button {
    margin-left: 8px;
  }
`
