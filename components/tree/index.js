import React, { PureComponent } from 'react'
import { OL, LI, IconArrow, Text } from './style'
import utils from '../../utils/utils'

function preOrder(node, level, callback) {
  if (node instanceof Array) { // 处理森林的情况
    for (var i = 0, len = node.length; i < len; i++) {
      preOrder(node[i], level, callback)
    }
  } else if (node) {
    let children = node.children
    // 处理每个节点
    if (callback instanceof Function) {
      let isLeaf = !children
      callback(node, level, isLeaf)
    }
    if (children) {
      level++
      for (let i = 0, len = children.length; i < len; i++) {
        preOrder(children[i], level, callback)
      }
    }
  }
}

class TreeComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      renderTree: false
    }
    this.handleSelect = this.handleSelect.bind(this)
  }

  render() {
    const { list = [], defaultExpandAll = false, blockNode } = this.props

    if (list.length === 0) {
      return null
    }
    let { selectedKeys, expandedKeys } = this.state

    if (!selectedKeys) {
      selectedKeys = this.props.selectedKeys || []
      this.state.selectedKeys = selectedKeys
    }
    if (!expandedKeys) {
      expandedKeys = this.props.expandedKeys || (defaultExpandAll ? list.map(item => {
        return item.id
      }) : [])
      this.state.expandedKeys = expandedKeys
    }
    const treeList = utils.buildTree(JSON.parse(JSON.stringify(list)))

    // 给节点增加 level
    preOrder(treeList, 0, (node, level, isLeaf) => {
      node.level = level
      node.isLeaf = isLeaf
    })

    let nodes = [[]]
    let stack = []
    if (treeList instanceof Array) { // 处理森林的情况
      stack = [...treeList]
    } else {
      stack.push(treeList)
    }
    while (stack.length !== 0) {
      let currentNode = stack.shift()
      let { id, level, isLeaf, parentId, children, name } = currentNode
      let iconArrow

      const type = expandedKeys.indexOf(id) === -1 ? 'right' : 'down'
      if (!isLeaf) {
        iconArrow = (
          <IconArrow
            className="icon"
            aria-hidden="true"
            onClick={() => this.handleIconArrowClick(currentNode)}
          >
            <use href={ '#iconcaret' + type }></use>
          </IconArrow>
        )
      }

      if (children) {
        nodes[id] = []
        stack = stack.concat(children)
      }

      nodes[parentId].push(
        <LI
          className={ isLeaf ? '' : type}
          level={level}
          key={id}
        >
          { iconArrow }
          <Text
            blockNode
            selected={selectedKeys.indexOf(id) !== -1}
            onClick={() => this.handleSelect(currentNode)}
          >{ name }</Text>
          { children ? <OL>{ nodes[id] }</OL> : null }
        </LI>
      )
    }

    return <OL>{ nodes[0] }</OL>
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
      visible: true,
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
