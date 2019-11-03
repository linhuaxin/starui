import styled from 'styled-components'

const Button = styled.button`
  padding: 0 15px;
  text-align: center;
  height: 32px;
  line-height: 1.5;
  font-size: 14px;
  color: rgba(0,0,0,0.65);
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  box-shadow: 0 2px 0 rgba(0,0,0,0.015);
  cursor: pointer;
  outline: 0;
  transition: ${ props => props.animate ? 'all .3s cubic-bezier(.645, .045, .355, 1)' : ''};
  
  &.parent-width {
    width: 100%;
  }
`

export const DefaultButton = styled(Button)`
  &:hover, &:focus {
    color: #40a9ff;
    border-color: #40a9ff;
  }
  
`

export const PrimaryButton = styled(Button)`
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;
  text-shadow: 0 -1px 0 rgba(0,0,0,0.12);
  box-shadow: 0 2px 0 rgba(0,0,0,0.045);
  
  &:hover, &:focus {
    color: #fff;
    background-color: #40a9ff;
    border-color: #40a9ff;
  }
`
