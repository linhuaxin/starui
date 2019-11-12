import React, { PureComponent } from 'react'
import { OL, IconArrow, Text } from './style'
import utils from '../../utils/utils'
import HTML5Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import TreeNode from './treeNode'

function preOrder(node, level, callback) {
  if (node instanceof Array) { // 处理森林的情况
    for (let i = 0, len = node.length; i < len; i++) {
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
      renderTree: false,
      list: []
    }
    this.handleSelect = this.handleSelect.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    let {
      list = [],
      selectedKeys = [],
      expandedKeys = [],
      defaultExpandAll
    } = nextProps

    if (defaultExpandAll) {
      expandedKeys = list.map(item => {
        return item.id
      })
    }

    this.setState({
      list,
      selectedKeys,
      expandedKeys
    })
  }

  render() {
    const { blockNode } = this.props
    const { selectedKeys, expandedKeys, list } = this.state
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
            <use href={'#iconcaret' + type}></use>
          </IconArrow>
        )
      }

      if (children) {
        nodes[id] = []
        stack = stack.concat(children)
      }

      nodes[parentId].push(
        <TreeNode
          id={id}
          isLeaf={isLeaf}
          level={level}
          key={id}
          type={type}
          handleDrag={this.handleDrag.bind(this)}
        >
          {iconArrow}
          <Text
            blockNode={blockNode}
            selected={selectedKeys.indexOf(id) !== -1}
            onClick={() => this.handleSelect(currentNode)}
          >{name}</Text>
          {children ? <OL>{nodes[id]}</OL> : null}
        </TreeNode>
      )
    }

    return (
      <DndProvider backend={HTML5Backend}>
        <OL>{nodes[0]}</OL>
      </DndProvider>
    )
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

  /**
   * 拖拽事件
   */
  handleDrag(item, e, id) {
    let dragId = item.id
    let list = this.state.list

    let obj = utils.findObjectInArray(list, 'id', dragId)
    obj.parentId = id
    this.setState({ list: [...list] })

    let { onDragEnd } = this.props
    if (onDragEnd) {
      onDragEnd(item, obj)
    }
  }
}

export default TreeComponent
