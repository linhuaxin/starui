import React from 'react'
import { TreeContextProps } from './contextTypes'

export interface DataNode {
  key?: string | number
  title?: React.ReactNode
  children?: DataNode[]
}

export interface FlattenNode extends DataNode {
  parent: FlattenNode | null
  children: FlattenNode[]
  data: DataNode
  level: number
}

export interface TreeProps {
  prefixCls?: string
  checkable?: boolean
  treeData?: DataNode[]
}

export interface TreeState {
  treeData: DataNode[]
  flattenNodes: FlattenNode[]
}

export type Key = string | number

export type IconType = React.ReactNode | ((props: TreeNodeProps) => React.ReactNode)

export interface TreeNodeProps {
  eventKey?: Key
  prefixCls?: string
  className?: string
  style?: React.CSSProperties

  // By parent
  expanded?: boolean
  selected?: boolean
  checked?: boolean
  loaded?: boolean
  loading?: boolean
  halfChecked?: boolean
  title?: React.ReactNode | ((data: DataNode) => React.ReactNode)
  dragOver?: boolean
  dragOverGapTop?: boolean
  dragOverGapBottom?: boolean
  pos?: string
  domRef?: React.Ref<HTMLDivElement>
  data?: DataNode
  isStart?: boolean[]
  isEnd?: boolean[]
  active?: boolean
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>

  // By user
  isLeaf?: boolean
  checkable?: boolean
  selectable?: boolean
  disabled?: boolean
  disableCheckbox?: boolean
  icon?: IconType
  switcherIcon?: IconType
  children?: React.ReactNode

  // TODO
  level: number
}

export interface InternalTreeNodeProps extends TreeNodeProps {
  context?: TreeContextProps
}

export interface TreeNodeState {
  dragNodeHighlight: boolean
}

export interface EventDataNode extends Omit<DataNode, 'children'> {
  expanded: boolean
  selected: boolean
  checked: boolean
  loaded: boolean
  loading: boolean
  halfChecked: boolean
  dragOver: boolean
  dragOverGapTop: boolean
  dragOverGapBottom: boolean
  pos: string
  active: boolean
}

export type NodeElement = React.ReactElement<TreeNodeProps> & {
  selectHandle?: HTMLSpanElement
  type: {
    isTreeNode: boolean
  }
}

export interface Entity {
  node: NodeElement
  index: number
  key: Key
  pos: string
  parent?: Entity
  children?: Entity[]
}

export interface DataEntity extends Omit<Entity, 'node' | 'parent' | 'children'> {
  node: DataNode
  parent?: DataEntity
  children?: DataEntity[]
  level: number
}

export interface NodeListProps {
  prefixCls: string
  style: React.CSSProperties
  data: FlattenNode[]
  motion: any
  focusable?: boolean
  activeItem: FlattenNode
  focused?: boolean
  tabIndex: number
  checkable?: boolean
  selectable?: boolean
  disabled?: boolean

  expandedKeys: Key[]
  selectedKeys: Key[]
  checkedKeys: Key[]
  loadedKeys: Key[]
  loadingKeys: Key[]
  halfCheckedKeys: Key[]
  keyEntities: Record<Key, DataEntity>

  dragging: boolean
  dragOverNodeKey: Key
  dropPosition: number

  // Virtual list
  height: number
  itemHeight: number

  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
  onFocus?: React.FocusEventHandler<HTMLDivElement>
  onBlur?: React.FocusEventHandler<HTMLDivElement>
  onActiveChange: (key: Key) => void
}

export type ScrollTo = (scroll: { key: Key }) => void

export interface NodeListRef {
  scrollTo: ScrollTo
}
