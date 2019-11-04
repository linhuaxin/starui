import React, { PureComponent } from 'react'
import { Tree, Node, IconArrow, Text } from './style'
import utils from '../../utils/utils'

function preOrder(node, level, expandedKeys, callback) {
  if (node instanceof Array) { // 处理森林的情况
    for (var i = 0, len = node.length; i < len; i++) {
      preOrder(node[i], level, expandedKeys, callback)
    }
  } else if (node) {
    let children = node.children
    // 处理每个节点
    if (callback instanceof Function) {
      let isLeaf = !children
      callback(node, level, isLeaf)
    }
    if (children && expandedKeys.indexOf(node.id) !== -1) {
      level++
      for (let i = 0, len = children.length; i < len; i++) {
        preOrder(children[i], level, expandedKeys, callback)
      }
    }
  }
}

class TreeComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    this.handleSelect = this.handleSelect.bind(this)
  }

  render() {
    const { list = [] } = this.props
    let { selectedKeys, expandedKeys } = this.state

    if (!selectedKeys) {
      selectedKeys = this.props.selectedKeys || []
      this.state.selectedKeys = selectedKeys
    }
    if (!expandedKeys) {
      expandedKeys = this.props.expandedKeys || []
      this.state.expandedKeys = expandedKeys
    }
    const treeList = utils.buildTree(JSON.parse(JSON.stringify(list)))
    const treeNodes = []

    // 给节点增加 level
    preOrder(treeList, 0, expandedKeys, (node, level, isLeaf) => {
      node.level = level
      node.isLeaf = isLeaf

      let iconArrow
      if (!isLeaf) {
        const type = expandedKeys.indexOf(node.id) === -1 ? 'right' : 'down'
        iconArrow = (
          <IconArrow
            className="icon"
            aria-hidden="true"
            onClick={() => this.handleIconArrowClick(node)}
          >
            <use href={ '#iconcaret' + type }></use>
          </IconArrow>
        )
      }

      treeNodes.push(
        <Node key={node.id} level={node.level}>
          { iconArrow }
          <Text
            selected={selectedKeys.indexOf(node.id) !== -1}
            onClick={() => this.handleSelect(node)}
          >{ node.name }</Text>
        </Node>
      )
    })

    return <Tree>{ treeNodes }</Tree>
  }

  /**
   * 点击箭头图标事件
   */
  handleIconArrowClick(node) {
    let { expandedKeys } = this.state
    let index = expandedKeys.indexOf(node.id)

    if (index === -1) {
      expandedKeys.push(node.id)
    } else {
      expandedKeys.splice(index, 1)
    }

    this.setState({
      expandedKeys: [...expandedKeys]
    })
  }

  /**
   * 节点选中事件
   */
  handleSelect(node) {
    this.setState({
      selectedKeys: [node.id]
    })
  }
}

export default TreeComponent
