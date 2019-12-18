import styled from 'styled-components'

export const Tabs = styled.div`
  display: flex;
`

export const Tab = styled.div`
  margin-right: 12px;
  color: rgba(0,0,0,0.65);
  cursor: pointer;
  
  &.active, &:hover {
    color: #1890ff;
  }
`
