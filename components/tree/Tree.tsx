import React from 'react'
import classNames from 'classnames'
import TreeNode from './TreeNode'
import { EventDataNode, TreeProps, TreeState } from './interface'
import { flattenTreeData } from './utils/treeUtils'
import { TreeContext } from './contextTypes'

class Tree extends React.Component<TreeProps, TreeState> {

  static defaultProps = {
    prefixCls: 'rc-tree',
    checkable: true
  }

  state: TreeState = {
    treeData: [],
    flattenNodes: []
  }

  onNodeCheck = (
    e: React.MouseEvent<HTMLDivElement>,
    treeNode: EventDataNode,
    checked: boolean
  ) => {
  }

  static getDerivedStateFromProps(props: TreeProps) {
    const { treeData } = props
    const newState: Partial<TreeState> = {}

    newState.flattenNodes = flattenTreeData(treeData)
    return newState
  }

  render() {
    const {
      prefixCls,
      checkable
    } = this.props
    const { flattenNodes } = this.state

    return (
      <TreeContext.Provider
        value={{
          prefixCls,
          checkable,
          onNodeCheck: this.onNodeCheck
        }}
      >
        <div className={classNames(`${prefixCls}`)}>
          {
            flattenNodes.map(item => {
              return <TreeNode {...item} />
            })
          }
        </div>
      </TreeContext.Provider>
    )
  }
}

export default Tree
