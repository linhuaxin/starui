import React from 'react'

export interface DataNode {
  checkable?: boolean
  children?: DataNode[]
  disabled?: boolean
  disableCheckbox?: boolean
  isLeaf?: boolean
  key: string | number
  title?: React.ReactNode
  selectable?: boolean
  className?: string
  style?: React.CSSProperties
}

export interface FlattenNode extends DataNode {
  parent: FlattenNode | null
  children: FlattenNode[]
  data: DataNode
  isStart: boolean[]
  isEnd: boolean[]
}

export interface TreeProps {
  treeData?: DataNode[]
}

export interface TreeState {
  treeData: DataNode[]
  flattenNodes: FlattenNode[]
}
