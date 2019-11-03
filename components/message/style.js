import styled from 'styled-components'

const defaultTop = '-9999px'
const beforeTop = '-41px'
const afterTop = '16px'

export const Message = styled.div`
  visibility: ${props => props.visible ? 'visible' : '' }
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: 'tnum';
  position: fixed;
  top: ${defaultTop};
  left: 0;
  z-index: 1010;
  width: 100%;
  display: flex;
  justify-content: center;
  
  &.message-enter {
    top: ${beforeTop};
  }
  
  &.message-enter-active {
    top: ${afterTop};
    transition: top .1s ease-in;
  }
  
  &.message-enter-done {
    top: ${afterTop};
  }
  
  &.message-exit {
    top: ${afterTop};
  }
  
  &.message-exit-active {
    top: ${beforeTop};
    transition: top .1s ease-out;
  }
  
  &.message-exit-done {
    top: ${defaultTop};
  }
`

export const ContentWrapper = styled.div`
  padding: 10px 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
`

export const Icon = styled.svg`
  margin-right: 8px;
  width: 16px;
  height: 16px;
`

export const Content = styled.span`
`