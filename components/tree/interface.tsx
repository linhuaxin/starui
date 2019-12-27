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

export interface CheckInfo {
  event: 'check'
  node: EventDataNode
  checked: boolean
  nativeEvent: MouseEvent
  checkedNodes: DataNode[]
  checkedNodesPositions?: { node: DataNode; pos: string }[]
  halfCheckedKeys?: Key[]
}

export interface TreeProps {
  prefixCls: string
  className?: string
  style?: React.CSSProperties
  focusable?: boolean
  tabIndex?: number
  children?: React.ReactNode
  treeData?: DataNode[]
  showLine?: boolean
  showIcon?: boolean
  icon?: IconType
  selectable?: boolean
  disabled?: boolean
  multiple?: boolean
  checkable?: boolean
  checkStrictly?: boolean
  draggable?: boolean
  defaultExpandParent?: boolean
  autoExpandParent?: boolean
  defaultExpandAll?: boolean
  defaultExpandedKeys?: Key[]
  expandedKeys?: Key[]
  defaultCheckedKeys?: Key[]
  checkedKeys?: (Key)[] | { checked: (Key)[]; halfChecked: Key[] }
  defaultSelectedKeys?: Key[]
  selectedKeys?: Key[]
  onFocus?: React.FocusEventHandler<HTMLDivElement>
  onBlur?: React.FocusEventHandler<HTMLDivElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
  onClick?: (e: React.MouseEvent, treeNode: EventDataNode) => void
  onDoubleClick?: (e: React.MouseEvent, treeNode: EventDataNode) => void
  onExpand?: (
    expandedKeys: Key[],
    info: {
      node: EventDataNode
      expanded: boolean
      nativeEvent: MouseEvent
    },
  ) => void
  onCheck?: (
    checked: { checked: Key[]; halfChecked: Key[] } | Key[],
    info: CheckInfo,
  ) => void
  onSelect?: (
    selectedKeys: Key[],
    info: {
      event: 'select'
      selected: boolean
      node: EventDataNode
      selectedNodes: DataNode[]
      nativeEvent: MouseEvent
    },
  ) => void
  onLoad?: (
    loadedKeys: Key[],
    info: {
      event: 'load'
      node: EventDataNode
    },
  ) => void
  loadData?: (treeNode: EventDataNode) => Promise<void>
  loadedKeys?: Key[]
  onMouseEnter?: (info: {
    event: React.MouseEvent
    node: EventDataNode
  }) => void
  onMouseLeave?: (info: {
    event: React.MouseEvent
    node: EventDataNode
  }) => void
  onRightClick?: (info: {
    event: React.MouseEvent
    node: EventDataNode
  }) => void
  onDragStart?: (info: {
    event: React.MouseEvent
    node: EventDataNode
  }) => void
  onDragEnter?: (info: {
    event: React.MouseEvent
    node: EventDataNode
    expandedKeys: Key[]
  }) => void
  onDragOver?: (info: { event: React.MouseEvent; node: EventDataNode }) => void
  onDragLeave?: (info: {
    event: React.MouseEvent
    node: EventDataNode
  }) => void
  onDragEnd?: (info: { event: React.MouseEvent; node: EventDataNode }) => void
  onDrop?: (info: {
    event: React.MouseEvent
    node: EventDataNode
    dragNode: EventDataNode
    dragNodesKeys: Key[]
    dropPosition: number
    dropToGap: boolean
  }) => void
  onActiveChange?: (key: Key) => void
  filterTreeNode?: (treeNode: EventDataNode) => boolean
  motion?: any
  switcherIcon?: IconType

  // Virtual List
  height?: number
  itemHeight?: number
}

export interface TreeState {
  keyEntities: Record<Key, DataEntity>

  selectedKeys: Key[]
  checkedKeys: Key[]
  halfCheckedKeys: Key[]
  loadedKeys: Key[]
  loadingKeys: Key[]
  expandedKeys: Key[]

  dragging: boolean
  dragNodesKeys: Key[]
  dragOverNodeKey: Key
  dropPosition: number

  treeData: DataNode[]
  flattenNodes: FlattenNode[]

  focused: boolean
  activeKey: Key

  prevProps: TreeProps
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

export interface TreeNodeRequiredProps {
  expandedKeys: Key[]
  selectedKeys: Key[]
  loadedKeys: Key[]
  loadingKeys: Key[]
  checkedKeys: Key[]
  halfCheckedKeys: Key[]
  dragOverNodeKey: Key
  dropPosition: number
  keyEntities: Record<Key, DataEntity>
}

export interface MotionTreeNodeProps extends Omit<TreeNodeProps, 'domRef'> {
  active: boolean
  motion?: any
  motionNodes?: FlattenNode[]
  onMotionEnd: () => void
  motionType?: 'show' | 'hide'
  treeNodeRequiredProps: TreeNodeRequiredProps
}

export interface Wrapper {
  posEntities: Record<string, Entity>;
  keyEntities: Record<Key, Entity>;
}
