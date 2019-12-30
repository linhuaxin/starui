import React from 'react'
import { DataEntity, DataNode, NodeListProps, NodeListRef } from './interface'
import MotionTreeNode from './MotionTreeNode'

export const MOTION_KEY = `RC_TREE_MOTION_${Math.random()}`;

const MotionNode: DataNode = {
  key: MOTION_KEY
}

export const MotionEntity: DataEntity = {
  key: MOTION_KEY,
  level: 0,
  index: 0,
  pos: '0',
  node: MotionNode
}

const RefNodeList: React.RefForwardingComponent<NodeListRef, NodeListProps> = (props, ref) => {

  const {
    prefixCls,
    data,
    selectable,
    checkable,
    expandedKeys,
    selectedKeys,
    checkedKeys,
    loadedKeys,
    loadingKeys,
    halfCheckedKeys,
    keyEntities,
    disabled,

    dragging,
    dragOverNodeKey,
    dropPosition,
    motion,

    height,
    itemHeight,

    focusable,
    activeItem,
    focused,
    tabIndex,

    onKeyDown,
    onFocus,
    onBlur,
    onActiveChange,

    ...domProps
  } = props

  const treeNodeRequiredProps = {
    expandedKeys,
    selectedKeys,
    loadedKeys,
    loadingKeys,
    checkedKeys,
    halfCheckedKeys,
    dragOverNodeKey,
    dropPosition,
    keyEntities
  }

  function onMotionEnd() {
  }

  return (
    <>
      <MotionTreeNode
        active={!!activeItem}
        motion={motion}
        treeNodeRequiredProps={treeNodeRequiredProps}
        motionNodes={data}
        onMotionEnd={onMotionEnd}
        onMouseMove={() => {
          onActiveChange(null)
        }}
      />
    </>
  )
}

export default RefNodeList
