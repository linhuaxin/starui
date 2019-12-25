import React from 'react'
import { TreeProps, TreeState } from './interface'
import { flattenTreeData } from './utils/treeUtils'

class Tree extends React.Component<TreeProps, TreeState> {

  state: TreeState = {
    treeData: [],
    flattenNodes: []
  }

  static getDerivedStateFromProps(props: TreeProps) {
    const { treeData } = props
    const newState: Partial<TreeState> = {}

    if (treeData) {
      newState.flattenNodes = flattenTreeData(treeData)
    }

    return newState
  }

  render() {
    const { flattenNodes } = this.state

    return (
      <div>
        {
          flattenNodes.map(item => {
            return (
              <div>{item.title}</div>
            )
          })
        }
      </div>
    )
  }
}

export default Tree
