import styled from 'styled-components'

const nodePaddingLeft = 18

export const OL = styled.ul`
`

export const LI = styled.li`
  padding-left: ${props => props.level * nodePaddingLeft + 'px'};
  overflow: hidden;
  
  &.right {
    ul {
      li {
        max-height: 0;
        transition: max-height 200ms linear;
      }
    }
  }
  
  &.down {
    ul {
      li {
        max-height: 1000px;
        transition: max-height 5s linear;
      }
    }
  }
`

export const IconArrow = styled.svg`
  width: 10px;
  height: 10px;
  cursor: pointer;
`

export const Text = styled.span`
  display: inline-block;
  height: 24px;
  width: calc(100% - 24px);
  margin: 0;
  padding: 0 5px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 24px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: ${props => props.selected ? '#bae7ff' : ''};
`
