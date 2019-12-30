import React from 'react'
import classNames from 'classnames'
import NodeList, { MOTION_KEY, MotionEntity } from './NodeList'
import { CheckInfo, EventDataNode, FlattenNode, TreeProps, TreeState } from './interface'
import { convertDataToEntities, flattenTreeData, parseCheckedKeys } from './utils/treeUtils'
import { TreeContext } from './contextTypes'
import { arrAdd, arrDel, conductExpandParent } from './util'
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
        let { checkedKeys = [], halfCheckedKeys } = checkedKeyEntity

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

          onNodeCheck: this.onNodeCheck,
          onNodeExpand: this.onNodeExpand
        }}
      >
        <div className={classNames(prefixCls)}>
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
