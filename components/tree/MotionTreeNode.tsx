import React from 'react'
import TreeNode from './TreeNode'
import { FlattenNode, MotionTreeNodeProps } from './interface'
import { getTreeNodeProps } from './utils/treeUtils'

const MotionTreeNode: React.FC<MotionTreeNodeProps> = (
  {
    className,
    style,
    motion,
    motionNodes,
    motionType,
    onMotionEnd,
    active,
    treeNodeRequiredProps,
    ...props
  },
  ref
) => {
  return (
    <div>
      {
        motionNodes.map((treeNode: FlattenNode) => {
          const {
            data: { key, ...restProps },
          } = treeNode
          delete restProps.children

          const treeNodeProps = getTreeNodeProps(key, treeNodeRequiredProps)

          return (
            <TreeNode
              {...restProps}
              {...treeNodeProps}
              active={active}
              data={treeNode.data}
              key={key}
            />
          )
        })
      }
    </div>
  )
}

export default MotionTreeNode
