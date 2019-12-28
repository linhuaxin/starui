import React from 'react'
import classNames from 'classnames'
import NodeList, { MOTION_KEY, MotionEntity } from './NodeList'
import { CheckInfo, EventDataNode, TreeProps, TreeState } from './interface'
import { convertDataToEntities, flattenTreeData, parseCheckedKeys } from './utils/treeUtils'
import { TreeContext } from './contextTypes'
import { arrAdd, arrDel } from './util'

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
    return flattenNodes.find(({ data: { key }}) => key === activeKey) || null
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
    }
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
    const { treeData, checkable } = props
    const newState: Partial<TreeState> = {
      prevProps: props
    }

    if (treeData) {
      newState.flattenNodes = flattenTreeData(treeData)
      const entitiesMap = convertDataToEntities(treeData)
      newState.keyEntities = {
        [MOTION_KEY]: MotionEntity,
        ...entitiesMap.keyEntities
      }
    }

    if (checkable) {
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
          checkable,
          keyEntities,
          onNodeCheck: this.onNodeCheck
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
