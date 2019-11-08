import styled, { css } from 'styled-components'

export const Wrapper = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export const CheckInner = styled.span`
  position: relative;
  top: 0;
  left: 0;
  display: block;
  width: 16px;
  height: 16px;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  border-collapse: separate;
  transition: all 0.3s;
  
  ${props => props.checked && css`
    background-color: #1890ff;
    border-color: #1890ff;
  `}
  
  &::after {
    box-sizing: border-box;
    position: absolute;
    display: table;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) scale(1) translate(-50%, -50%);
    opacity: 1;
    transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
    content: ' ';
    top: 50%;
    left: 22%;
    width: 5.71428571px;
    height: 9.14285714px;
  }
`

export const Checkbox = styled.span`
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  width: 16px;
  height: 16px;
`

export const Input = styled.input.attrs({
  type: 'checkbox'
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  opacity: 0;
`

export const Content = styled.span`
  padding-left: 8px;
`
