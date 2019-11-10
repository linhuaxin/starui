import styled from 'styled-components'

const nodePaddingLeft = 18

export const Node = styled.div`
  padding-left: ${props => props.level * nodePaddingLeft + 'px'};
  overflow: hidden;
  opacity: ${props => props.isDragging ? 0.5 : 1 };
  cursor: move;
  
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
