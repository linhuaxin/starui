import React from 'react'
import { DataEntity, EventDataNode, IconType, Key, NodeInstance } from './interface'

type NodeMouseEventHandler = (e: React.MouseEvent<HTMLDivElement>, node: EventDataNode) => void
type NodeDragEventHandler = (e: React.MouseEvent<HTMLDivElement>, node: NodeInstance) => void

export interface TreeContextProps {
  prefixCls: string
  selectable: boolean
  showIcon: boolean
  icon: IconType
  switcherIcon: IconType
  draggable: boolean
  checkable: boolean | React.ReactNode
  checkStrictly: boolean
  disabled: boolean
  keyEntities: Record<Key, DataEntity>

  loadData: (treeNode: EventDataNode) => Promise<void>
  filterTreeNode: (treeNode: EventDataNode) => boolean

  onNodeCheck: (
    e: React.MouseEvent<HTMLDivElement>,
    treeNode: EventDataNode,
    checked: boolean,
  ) => void
  onNodeClick: NodeMouseEventHandler
  onNodeExpand: NodeMouseEventHandler
  // onNodeDoubleClick: NodeMouseEventHandler
  onNodeSelect: NodeMouseEventHandler
  // onNodeLoad: (treeNode: EventDataNode) => void
  onNodeMouseEnter: NodeMouseEventHandler
  onNodeMouseLeave: NodeMouseEventHandler
  // onNodeContextMenu: NodeMouseEventHandler
  onNodeDragStart: NodeDragEventHandler
  onNodeDragEnter: NodeDragEventHandler
  onNodeDragOver: NodeDragEventHandler
  onNodeDragLeave: NodeDragEventHandler
  onNodeDragEnd: NodeDragEventHandler
  onNodeDrop: NodeDragEventHandler
}

export const TreeContext: React.Context<TreeContextProps | null>
  = React.createContext(null)
