import * as React from 'react'

type NodeMouseEventHandler = (e: React.MouseEvent<HTMLDivElement>, node: any) => void
type NodeDragEventHandler = (e: React.MouseEvent<HTMLDivElement>, node: any) => void

export interface TreeContextProps {
  prefixCls: string
  selectable: boolean
  showIcon: boolean
  icon: any
  switcherIcon: any
  draggable: boolean
  checkable: boolean | React.ReactNode
  checkStrictly: boolean
  disabled: boolean
  keyEntities: any

  loadData: any
  filterTreeNode: any

  onNodeClick: NodeMouseEventHandler
  onNodeDoubleClick: NodeMouseEventHandler
  onNodeExpand: NodeMouseEventHandler
  onNodeSelect: NodeMouseEventHandler
  onNodeCheck: (
    e: React.MouseEvent<HTMLDivElement>,
    treeNode: any,
    checked: boolean
  ) => void
  onNodeLoad: (treeNode: any) => void
  onNodeMouseEnter: NodeMouseEventHandler
  onNodeMouseLeave: NodeMouseEventHandler
  onNodeContextMenu: NodeMouseEventHandler
  onNodeDragStart: NodeDragEventHandler
  onNodeDragEnter: NodeDragEventHandler
  onNodeDragOver: NodeDragEventHandler
  onNodeDragLeave: NodeDragEventHandler
  onNodeDragEnd: NodeDragEventHandler
  onNodeDrop: NodeDragEventHandler
}

export const TreeContext: React.Context<TreeContextProps | null> = React.createContext(null)
