import React from 'react'
import classNames from 'classnames'
import NodeList, { MOTION_KEY, MotionEntity } from './NodeList'
import { CheckInfo, EventDataNode, FlattenNode, Key, NodeInstance, TreeProps, TreeState } from './interface'
import {
  convertDataToEntities,
  convertNodePropsToEventData,
  flattenTreeData,
  parseCheckedKeys
} from './utils/treeUtils'
import { TreeContext } from './contextTypes'
import {
  arrAdd,
  arrDel,
  calcDropPosition,
  calcSelectedKeys,
  conductExpandParent,
  getDragNodesKeys,
  posToArr
} from './util'
import { conductCheck } from './utils/conductUtil'

class Tree extends React.Component<TreeProps, TreeState> {

  static defaultProps = {
    prefixCls: 'rc-tree',
    showLine: false,
    showIcon: true,
    selectable: true,
    multiple: false,
    checkable: false,
    disabled: false,
    checkStrictly: false,
    draggable: false,
    defaultExpandParent: true,
    autoExpandParent: false,
    defaultExpandAll: false,
    defaultExpandedKeys: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: []
  }

  state: TreeState = {
    keyEntities: {},

    selectedKeys: [],
    checkedKeys: [],
    halfCheckedKeys: [],
    loadedKeys: [],
    loadingKeys: [],
    expandedKeys: [],

    dragging: false,
    dragNodesKeys: [],
    dragOverNodeKey: null,
    dropPosition: null,

    treeData: [],
    flattenNodes: [],

    focused: false,
    activeKey: null,

    prevProps: null
  }

  dragNode: NodeInstance

  delayedDragEnterLogic: Record<Key, number>

  getActiveItem() {
    const { activeKey, flattenNodes } = this.state
    if (activeKey === null) {
      return null
    }
    return flattenNodes.find(({ data: { key } }) => key === activeKey) || null
  }

  getTreeNodeRequiredProps() {
    const {
      expandedKeys = [],
      selectedKeys = [],
      loadedKeys = [],
      loadingKeys = [],
      checkedKeys = [],
      halfCheckedKeys = [],
      dragOverNodeKey,
      dropPosition,
      keyEntities
    } = this.state

    return {
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
  }

  setUncontrolledState = state => {
    let needSync = false
    const newState = {}

    Object.keys(state).forEach(name => {
      if (name in this.props) return

      needSync = true
      newState[name] = state[name]
    })

    if (needSync) {
      this.setState(newState)
    }
  }

  onNodeClick = (
    e: React.MouseEvent<HTMLDivElement>,
    treeNode: EventDataNode
  ) => {
    const { onClick } = this.props
    if (onClick) {
      onClick(e, treeNode)
    }
  }

  onNodeCheck = (
    e: React.MouseEvent<HTMLDivElement>,
    treeNode: EventDataNode,
    checked: boolean
  ) => {
    const {
      keyEntities,
      checkedKeys: oriCheckedKeys,
      halfCheckedKeys: oriHalfCheckedKeys
    } = this.state
    const { checkStrictly, onCheck } = this.props
    const { key } = treeNode

    let checkedObj
    const eventObj: Partial<CheckInfo> = {
      event: 'check',
      node: treeNode,
      checked,
      nativeEvent: e.nativeEvent
    }

    if (checkStrictly) {
      const checkedKeys = checked ? arrAdd(oriCheckedKeys, key) : arrDel(oriCheckedKeys, key)
      const halfCheckedKeys = arrDel(oriHalfCheckedKeys, key)

      checkedObj = { checked: checkedKeys, halfChecked: halfCheckedKeys }
      eventObj.checkedNodes = checkedKeys
        .map(checkedKey => keyEntities[checkedKey])
        .filter(entity => entity)
        .map(entity => entity.node)

      this.setUncontrolledState({ checkedKeys })
    } else {
      let { checkedKeys, halfCheckedKeys } = conductCheck(
        [...oriCheckedKeys, key],
        true,
        keyEntities
      )

      if (!checked) {
        const keySet = new Set(checkedKeys)
        keySet.delete(key);
        ({ checkedKeys, halfCheckedKeys } = conductCheck(
          Array.from(keySet),
          { checked: false, halfCheckedKeys },
          keyEntities
        ))
      }

      checkedObj = checkedKeys

      eventObj.checkedNodes = []
      eventObj.checkedNodesPositions = []
      eventObj.halfCheckedKeys = []

      checkedKeys.forEach(checkedKey => {
        const entity = keyEntities[checkedKey]
        if (!entity) return

        const { node, pos } = entity

        eventObj.checkedNodes.push(node)
        eventObj.checkedNodesPositions.push({ node, pos })
      })

      this.setUncontrolledState({
        checkedKeys,
        halfCheckedKeys
      })
    }

    if (onCheck) {
      onCheck(checkedObj, eventObj as CheckInfo)
    }
  }

  onNodeExpand = (
    e: React.MouseEvent<HTMLDivElement>,
    treeNode: EventDataNode
  ) => {
    let { expandedKeys } = this.state
    const { treeData } = this.state
    const { onExpand, loadData } = this.props
    const { key, expanded } = treeNode

    const index = expandedKeys.indexOf(key)
    const targetExpanded = !expanded

    if (targetExpanded) {
      expandedKeys = arrAdd(expandedKeys, key)
    } else {
      expandedKeys = arrDel(expandedKeys, key)
    }

    const flattenNodes: FlattenNode[] = flattenTreeData(treeData, expandedKeys)
    this.setUncontrolledState({ expandedKeys, flattenNodes })

    if (onExpand) {
      onExpand(expandedKeys, {
        node: treeNode,
        expanded: targetExpanded,
        nativeEvent: e.nativeEvent
      })
    }

    return null
  }

  onFocus = () => {
  }

  onBlur = () => {
  }

  onKeyDown = () => {
  }

  onActiveChange = () => {
  }

  onNodeSelect = (
    e: React.MouseEvent<HTMLDivElement>,
    treeNode: EventDataNode
  ) => {
    let { selectedKeys } = this.state
    const { keyEntities } = this.state
    const { onSelect, multiple } = this.props
    const { selected, key } = treeNode
    const targetSelected = !selected

    if (!targetSelected) {
      selectedKeys = arrDel(selectedKeys, key)
    } else if (!multiple) {
      selectedKeys = [key]
    } else {
      selectedKeys = arrAdd(selectedKeys, key)
    }

    const selectedNodes = selectedKeys
      .map(selectedKey => {
        const entity = keyEntities[selectedKey]
        if (!entity) return null
        return entity.node
      })
      .filter(node => node)

    this.setUncontrolledState({ selectedKeys })

    if (onSelect) {
      onSelect(selectedKeys, {
        event: 'select',
        selected: targetSelected,
        node: treeNode,
        selectedNodes,
        nativeEvent: e.nativeEvent
      })
    }
  }

  onNodeDragStart = (
    event: React.MouseEvent<HTMLDivElement>,
    node: NodeInstance,
  ) => {
    const { expandedKeys, keyEntities } = this.state
    const { onDragStart } = this.props
    const { eventKey } = node.props

    this.dragNode = node

    this.setState({
      dragging: true,
      dragNodesKeys: getDragNodesKeys(eventKey, keyEntities),
      expandedKeys: arrDel(expandedKeys, eventKey)
    })

    if (onDragStart) {
      onDragStart({ event, node: convertNodePropsToEventData(node.props)})
    }
  }

  onNodeDragEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    node: NodeInstance,
  ) => {
    console.log('onNodeDragEnter')
    const { expandedKeys, keyEntities } = this.state
    const { onDragEnter } = this.props
    const { pos, eventKey } = node.props

    if (!this.dragNode) return

    const dropPosition = calcDropPosition(event, node)

    // Skip if drag node is self
    if (this.dragNode.props.eventKey === eventKey && dropPosition === 0) {
      this.setState({
        dragOverNodeKey: '',
        dropPosition: null,
      })
      return
    }

    setTimeout(() => {
      // Update drag over node
      this.setState({
        dragOverNodeKey: eventKey,
        dropPosition,
      })

      // Side effect for delay drag
      if (!this.delayedDragEnterLogic) {
        this.delayedDragEnterLogic = {}
      }
      Object.keys(this.delayedDragEnterLogic).forEach(key => {
        clearTimeout(this.delayedDragEnterLogic[key])
      })
      this.delayedDragEnterLogic[pos] = window.setTimeout(() => {
        if (!this.state.dragging) return

        let newExpandedKeys = [...expandedKeys]
        const entity = keyEntities[eventKey]

        if (entity && (entity.children || []).length) {
          newExpandedKeys = arrAdd(expandedKeys, eventKey)
        }

        if (!('expandedKeys' in this.props)) {
          this.setState({
            expandedKeys: newExpandedKeys,
          })
        }

        if (onDragEnter) {
          onDragEnter({
            event,
            node: convertNodePropsToEventData(node.props),
            expandedKeys: newExpandedKeys,
          })
        }
      }, 400)
    }, 0)
  }

  onNodeDragOver = (
    event: React.MouseEvent<HTMLDivElement>,
    node: NodeInstance,
  ) => {
    console.log('onNodeDragOver')
    const { onDragOver } = this.props
    const { eventKey } = node.props

    // Update drag position
    if (this.dragNode && eventKey === this.state.dragOverNodeKey) {
      const dropPosition = calcDropPosition(event, node)

      if (dropPosition === this.state.dropPosition) return

      this.setState({
        dropPosition
      })
    }

    if (onDragOver) {
      onDragOver({ event, node: convertNodePropsToEventData(node.props) })
    }
  }

  onNodeDragLeave = (
    event: React.MouseEvent<HTMLDivElement>,
    node: NodeInstance,
  ) => {
    console.log('onNodeDragLeave')
    const { onDragLeave } = this.props

    this.setState({
      dragOverNodeKey: ''
    })

    if (onDragLeave) {
      onDragLeave({ event, node: convertNodePropsToEventData(node.props) })
    }
  }

  onNodeDragEnd = (
    event: React.MouseEvent<HTMLDivElement>,
    node: NodeInstance,
  ) => {
    console.log('onNodeDragEnd')
    const { onDragEnd } = this.props
    this.setState({
      dragOverNodeKey: ''
    });
    this.cleanDragState()

    if (onDragEnd) {
      onDragEnd({ event, node: convertNodePropsToEventData(node.props) })
    }

    this.dragNode = null
  }

  onNodeDrop = (
    event: React.MouseEvent<HTMLDivElement>,
    node: NodeInstance
  ) => {
    console.log('onNodeDrop')
    const { dragNodesKeys = [], dropPosition } = this.state
    const { onDrop } = this.props
    const { eventKey, pos } = node.props

    this.setState({
      dragOverNodeKey: ''
    })
    this.cleanDragState()

    if (dragNodesKeys.indexOf(eventKey) !== -1) {
      return
    }

    const posArr = posToArr(pos)

    const dropResult = {
      event,
      node: convertNodePropsToEventData(node.props),
      dragNode: convertNodePropsToEventData(this.dragNode.props),
      dragNodesKeys: dragNodesKeys.slice(),
      dropPosition: dropPosition + Number(posArr[posArr.length - 1]),
      dropToGap: false
    }

    if (dropPosition !== 0) {
      dropResult.dropToGap = true
    }

    if (onDrop) {
      onDrop(dropResult)
    }

    this.dragNode = null
  }

  cleanDragState = () => {
    const { dragging } = this.state
    if (dragging) {
      this.setState({
        dragging: false
      })
    }
  }

  onNodeMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    node: EventDataNode
  ) => {
    const { onMouseEnter } = this.props
    if (onMouseEnter) {
      onMouseEnter({ event, node })
    }
  }

  onNodeMouseLeave = (
    event: React.MouseEvent<HTMLDivElement>,
    node: EventDataNode
  ) => {
    const { onMouseLeave } = this.props
    if (onMouseLeave) {
      onMouseLeave({ event, node })
    }
  }

  static getDerivedStateFromProps(props: TreeProps, prevState: TreeState) {
    const { prevProps } = prevState
    const { treeData } = props
    const newState: Partial<TreeState> = {
      prevProps: props
    }

    function needSync(name: string) {
      return (
        (!prevProps && name in props) ||
        (prevProps && prevProps[name] !== props[name])
      )
    }

    if (treeData) {
      newState.treeData = treeData
      const entitiesMap = convertDataToEntities(treeData)
      newState.keyEntities = {
        [MOTION_KEY]: MotionEntity,
        ...entitiesMap.keyEntities
      }
    }

    const keyEntities = newState.keyEntities || prevState.keyEntities

    // ================ expandedKeys =================
    if (
      needSync('expandedKeys') ||
      (prevProps && needSync('autoExpandParent'))
    ) {
      newState.expandedKeys =
        props.autoExpandParent || (!prevProps && props.defaultExpandParent)
          ? conductExpandParent(props.expandedKeys, keyEntities)
          : props.expandedKeys
    } else if (!prevProps && props.defaultExpandAll) {
      const cloneKeyEntities = { ...keyEntities }
      delete cloneKeyEntities[MOTION_KEY]
      newState.expandedKeys = Object.keys(cloneKeyEntities).map(
        key => cloneKeyEntities[key].key
      )
    } else if (!prevProps && props.defaultExpandedKeys) {
      newState.expandedKeys =
        props.autoExpandParent || props.defaultExpandParent
          ? conductExpandParent(props.defaultExpandedKeys, keyEntities)
          : props.defaultExpandedKeys
    }

    if (!newState.expandedKeys) {
      delete newState.expandedKeys
    }

    // ================= flattenNodes =================
    if (treeData || newState.expandedKeys) {
      newState.flattenNodes = flattenTreeData(
        treeData || prevState.treeData,
        newState.expandedKeys || prevState.expandedKeys
      )
    }

    // ================ selectedKeys =================
    if (props.selectable) {
      if (needSync('selectKeys')) {
        newState.selectedKeys = calcSelectedKeys(props.selectedKeys, props)
      } else if (!prevProps && props.defaultSelectedKeys) {
        newState.selectedKeys = calcSelectedKeys(
          props.defaultSelectedKeys,
          props
        )
      }
    }

    // ================= checkedKeys =================
    if (props.checkable) {
      let checkedKeyEntity

      if (!prevProps && props.defaultCheckedKeys) {
        checkedKeyEntity = parseCheckedKeys(props.defaultCheckedKeys) || {}
      } else if (treeData) {
        checkedKeyEntity = parseCheckedKeys(props.checkedKeys) || {
          checkedKeys: prevState.checkedKeys,
          halfCheckedKeys: prevState.halfCheckedKeys
        }
      }

      if (checkedKeyEntity) {
        let { checkedKeys = [], halfCheckedKeys = [] } = checkedKeyEntity

        if (!props.checkStrictly) {
          const conductKeys = conductCheck(checkedKeys, true, keyEntities);
          ({ checkedKeys, halfCheckedKeys } = conductKeys)
        }

        newState.checkedKeys = checkedKeys
        newState.halfCheckedKeys = halfCheckedKeys
      }
    }

    return newState
  }

  render() {
    const {
      prefixCls,
      className,
      style,
      showLine,
      focusable,
      tabIndex = 0,
      selectable,
      showIcon,
      icon,
      switcherIcon,
      draggable,
      checkable,
      checkStrictly,
      disabled,
      motion,
      loadData,
      filterTreeNode,
      height,
      itemHeight
    } = this.props

    const {
      focused,
      flattenNodes,
      keyEntities,
      dragging,
      activeKey,
    } = this.state

    return (
      <TreeContext.Provider
        value={{
          prefixCls,
          selectable,
          showIcon,
          icon,
          switcherIcon,
          draggable,
          checkable,
          checkStrictly,
          disabled,
          keyEntities,

          loadData,
          filterTreeNode,

          onNodeClick: this.onNodeClick,
          onNodeCheck: this.onNodeCheck,
          onNodeExpand: this.onNodeExpand,
          onNodeSelect: this.onNodeSelect,
          onNodeDragStart: this.onNodeDragStart,
          onNodeDragEnter: this.onNodeDragEnter,
          onNodeDragOver: this.onNodeDragOver,
          onNodeDragLeave: this.onNodeDragLeave,
          onNodeDragEnd: this.onNodeDragEnd,
          onNodeDrop: this.onNodeDrop,
          onNodeMouseEnter: this.onNodeMouseEnter,
          onNodeMouseLeave: this.onNodeMouseLeave
        }}
      >
        <div className={classNames(prefixCls, className, {
          [`${prefixCls}-show-line`]: showLine
        })}>
          <NodeList
            prefixCls={prefixCls}
            style={style}
            data={flattenNodes}
            disabled={disabled}
            selectable={selectable}
            checkable={checkable}
            motion={motion}
            dragging={dragging}
            height={height}
            itemHeight={itemHeight}
            focusable={focusable}
            focused={focused}
            tabIndex={tabIndex}
            activeItem={this.getActiveItem()}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyDown={this.onKeyDown}
            onActiveChange={this.onActiveChange}
            {...this.getTreeNodeRequiredProps()}
          />
        </div>
      </TreeContext.Provider>
    )
  }
}

export default Tree
