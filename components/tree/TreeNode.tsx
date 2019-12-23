import * as React from 'react'
import classNames from 'classnames'
import { TreeContext, TreeContextProps } from './contextTypes'
import {convertNodePropsToEventData} from './utils/treeUtil'
import {getDataAndAria} from './util'
import Indent from './indent'
import {polyfill} from 'react-lifecycles-compat'

const ICON_OPEN = 'open'
const ICON_CLOSE = 'close'
const defaultTitle = '---'

export interface TreeNodeProps {
  eventKey?: any
  prefixCls?: string
  className?: string
  style?: React.CSSProperties

  expanded?: boolean
  selected?: boolean
  checked?: boolean
  loaded?: boolean
  loading?: boolean
  halfChecked?: boolean
  title?: React.ReactNode | ((data: any) => React.ReactNode)
  dragOver?: boolean
  dragOverGapTop?: boolean
  dragOverGapBottom?: boolean
  pos?: string
  domRef?: React.Ref<HTMLDivElement>
  data?: any
  isStart?: boolean[]
  isEnd?: boolean[]
  active?: boolean
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>

  isLeaf?: boolean
  checkable?: boolean
  selectable?: boolean
  disabled?: boolean
  disableCheckbox?: boolean
  icon?: any
  switcherIcon?: any
  children?: React.ReactNode
}

export interface InternalTreeNodeProps extends TreeNodeProps {
  context?: any
}

export interface TreeNodeState {
  dragNodeHighlight: boolean
}

class InternelTreeNode extends React.Component<InternalTreeNodeProps, TreeNodeState> {
  public state = {
    dragNodeHighlight: false
  }

  public selectHandle: HTMLSpanElement

  componentDidMount() {
    this.syncLoadData(this.props)
  }

  componentDidUpdate() {
    this.syncLoadData(this.props)
  }

  onSelectorClick = e => {
    const {
      context: { onNodeClick }
    } = this.props

    onNodeClick(e, convertNodePropsToEventData(this.props))

    if (this.isSelectable()) {
      this.onSelect(e)
    } else {
      this.onCheck(e)
    }
  }

  onSelectorDoubleClick = e => {
    const {
      context: { onNodeDoubleClick }
    } = this.props
    onNodeDoubleClick(e, convertNodePropsToEventData(this.props))
  }

  onSelect = e => {
    if (this.isDisabled()) return

    const {
      context: { onNodeSelect }
    } = this.props
    e.preventDefault()
    onNodeSelect(e, convertNodePropsToEventData(this.props))
  }

  onCheck = e => {
    if (this.isDisabled()) return

    const { disableCheckbox, checked } = this.props
    const {
      context: { onNodeCheck }
    } = this.props

    if (!this.isCheckable() || disableCheckbox) return

    e.preventDefault()
    const targetChecked = !checked
    onNodeCheck(e, convertNodePropsToEventData(this.props), targetChecked)
  }

  onMouseEnter = e => {
    const {
      context: { onNodeMouseEnter }
    } = this.props
    onNodeMouseEnter(e, convertNodePropsToEventData(this.props))
  }

  onMouseLeave = e => {
    const {
      context: { onNodeMouseLeave }
    } = this.props
    onNodeMouseLeave(e, convertNodePropsToEventData(this.props))
  }

  onContextMenu = e => {
    const {
      context: { onNodeContextMenu }
    } = this.props
    onNodeContextMenu(e, convertNodePropsToEventData(this.props))
  }

  onDragStart = e => {
    const {
      context: { onNodeDragStart }
    } = this.props

    e.stopPropagation()
    this.setState({
      dragNodeHighlight: true
    })
    onNodeDragStart(e, this)

    try {
      e.dataTransfer.setData('text/plain', '')
    } catch (e) {
      // empty
    }
  }

  onDragEnter = e => {
    const {
      context: { onNodeDragEnter }
    } = this.props

    e.preventDefault()
    e.stopPropagation()
    onNodeDragEnter(e, this)
  }

  onDragOver = e => {
    const {
      context: { onNodeDragOver }
    } = this.props

    e.preventDefault()
    e.stopPropagation()
    onNodeDragOver(e, this)
  }

  onDragLeave = e => {
    const {
      context: { onNodeDragLeave }
    } = this.props

    e.stopPropagation()
    onNodeDragLeave(e, this)
  }

  onDragEnd = e => {
    const {
      context: { onNodeDragEnd }
    } = this.props

    e.stopPropagation()
    this.setState({
      dragNodeHighlight: false
    })
    onNodeDragEnd(e, this)
  }

  onDrop = e => {
    const {
      context: { onNodeDrop }
    } = this.props

    e.preventDefault()
    e.stopPropagation()
    this.setState({
      dragNodeHighlight: false
    })
    onNodeDrop(e, this)
  }

  onExpand: React.MouseEventHandler<HTMLDivElement> = e => {
    const {
      context: { onNodeExpand }
    } = this.props
    onNodeExpand(e, convertNodePropsToEventData(this.props))
  }

  setSelectHandle = node => {
    this.selectHandle = node
  }

  getNodeState = () => {
    const { expanded } = this.props

    if (this.isLeaf()) {
      return null
    }

    return expanded ? ICON_OPEN : ICON_CLOSE
  }

  hasChildren = () => {
    const {eventKey} = this.props
    const {
      context: {keyEntities}
    } = this.props

    const {children} = keyEntities[eventKey] || {}
    return !!(children || []).length
  }

  isLeaf = () => {
    const {isLeaf, loaded} = this.props
    const {
      context: {loadData}
    } = this.props

    const hasChildren = this.hasChildren()

    if (isLeaf === false) {
      return false
    }

    return isLeaf || (!loadData && !hasChildren) || (loadData && loaded && !hasChildren)
  }

  isDisabled = () => {
    const { disabled } = this.props
    const {
      context: { disabled: treeDisabled }
    } = this.props

    return !!(treeDisabled || disabled)
  }

  isCheckable = () => {
    const { checkable } = this.props
    const {
      context: { checkable: treeCheckable }
    } = this.props

    if (!treeCheckable || checkable === false) return false
    return treeCheckable
  }

  syncLoadData = props => {
    const {expanded, loading, loaded} = props
    const {
      context: {loadData, onNodeLoad}
    } = this.props

    if (loading) return

    if (loadData && expanded && !this.isLeaf()) {
      if (!this.hasChildren() && !loaded) {
        onNodeLoad(convertNodePropsToEventData(this.props))
      }
    }
  }

  isSelectable() {
    const {selectable} = this.props
    const {
      context: {selectable: treeSelectable}
    } = this.props

    if (typeof selectable === 'boolean') {
      return selectable
    }

    return treeSelectable
  }

  renderSwitcher = () => {
    const {expanded, switcherIcon: switcherIconFromProps} = this.props
    const {
      context: {prefixCls, switcherIcon: switcherIconFromCtx}
    } = this.props

    const switcherIcon = switcherIconFromProps || switcherIconFromCtx

    if (this.isLeaf()) {
      return (
        <span className={classNames(`${prefixCls}-switcher`, `${prefixCls}-switcher-noop`)}>
          {
            typeof switcherIcon === 'function'
              ? switcherIcon({...this.props, isLeaf: false})
              : switcherIcon
          }
        </span>
      )
    }

    const switcherCls = classNames(
      `${prefixCls}-switcher`,
      `${prefixCls}-switcher_${expanded ? ICON_OPEN : ICON_CLOSE}`
    )
    return (
      <span onClick={this.onExpand}>
      </span>
    )
  }

  renderCheckbox = () => {
    const { checked, halfChecked, disableCheckbox } = this.props
    const {
      context: { prefixCls }
    } = this.props
    const disabled = this.isDisabled()
    const checkable = this.isCheckable()

    if (!checkable) {
      return null
    }

    const $custom = typeof checkable !== 'boolean' ? checkable : null

    return (
      <span
        className={classNames(
          `${prefixCls}-checkbox`,
          checked && `${prefixCls}-checkbox-checked`,
          !checked && halfChecked && `${prefixCls}-checkbox-indeterminate`,
          (disabled || disableCheckbox) && `${prefixCls}-checkbox-disabled`
        )}
        onClick={this.onCheck}
      >
        {$custom}
      </span>
    )
  }

  renderIcon = () => {
    const { loading } = this.props
    const {
      context: { prefixCls }
    } = this.props

    return (
      <span
        className={classNames(
          `${prefixCls}-iconEle`,
          `${prefixCls}-icon__${this.getNodeState() || 'docu'}`,
          loading && `${prefixCls}-icon_loading`
        )}
      />
    )
  }

  renderSelector = () => {
    const { dragNodeHighlight } = this.state
    const { title, selected, icon, loading, data } = this.props
    const {
      context: { prefixCls, showIcon, icon: treeIcon, draggable, loadData }
    } = this.props
    const disabled = this.isDisabled()

    const wrapClass = `${prefixCls}-node-content-wrapper`

    let $icon

    if (showIcon) {
      const currentIcon = icon || treeIcon

      $icon = currentIcon ? (
        <span className={classNames(`${prefixCls}-iconEle`, `${prefixCls}-icon__customize`)}>
          {typeof currentIcon === 'function' ? currentIcon(this.props) : currentIcon}
        </span>
      ) : (
        this.renderIcon()
      )
    } else if (loadData && loading) {
      $icon = this.renderIcon()
    }

    const $title = (
      <span className={`${prefixCls}-title`}>
        {typeof title === 'function' ? title(data) : title}
      </span>
    )

    return (
      <span
        ref={this.setSelectHandle}
        title={typeof title === 'string' ? title : ''}
        className={classNames(
          `${wrapClass}`,
          `${wrapClass}-${this.getNodeState() || 'normal'}`,
          !disabled && (selected || dragNodeHighlight) && `${prefixCls}-node-selected`,
          !disabled && draggable && 'draggable'
        )}
        draggable={(!disabled && draggable) || undefined}
        aria-grabbed={(!disabled && draggable) || undefined}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.onContextMenu}
        onClick={this.onSelectorClick}
        onDoubleClick={this.onSelectorDoubleClick}
        onDragStart={draggable ? this.onDragStart : undefined}
      >
        {$icon}
        {$title}
      </span>
    )
  }

  render() {
    const {
      eventKey,
      className,
      style,
      dragOver,
      dragOverGapTop,
      dragOverGapBottom,
      isLeaf,
      isStart,
      isEnd,
      expanded,
      selected,
      checked,
      halfChecked,
      loading,
      domRef,
      active,
      onMouseMove,
      ...otherProps
    } = this.props

    const {
      context: { prefixCls, filterTreeNode, draggable, keyEntities }
    } = this.props
    const disabled = this.isDisabled()
    const dataOrAriaAttributeProps = getDataAndAria(otherProps)
    const { level } = keyEntities[eventKey] || {}

    return (
      <div
        ref={domRef}
        className={classNames(className, `${prefixCls}-treenode`, {
          [`${prefixCls}-treenode-disabled`]: disabled,
          [`${prefixCls}-treenode-switcher-${expanded ? 'open' : 'close'}`]: !isLeaf,
          [`${prefixCls}-treenode-checked`]: checked,
          [`${prefixCls}-treenode-indeterminate`]: halfChecked,
          [`${prefixCls}-treenode-selected`]: selected,
          [`${prefixCls}-treenode-loading`]: loading,
          [`${prefixCls}-treenode-active`]: active,
          'drag-over': !disabled && dragOver,
          'drag-over-gap-top': !disabled && dragOverGapTop,
          'drag-over-gap-bottom': !disabled && dragOverGapBottom,
          'filter-node': filterTreeNode && filterTreeNode(convertNodePropsToEventData(this.props))
        })}
        style={style}
        onDragEnter={draggable ? this.onDragEnter : undefined}
        onDragOver={draggable ? this.onDragOver : undefined}
        onDragLeave={draggable ? this.onDragLeave : undefined}
        onDrop={draggable ? this.onDrop : undefined}
        onDragEnd={draggable ? this.onDragEnd : undefined}
        {...dataOrAriaAttributeProps}
      >
        <Indent prefixCls={prefixCls} level={level} isStart={isStart} isEnd={isEnd}/>
        {this.renderSwitcher()}
        {this.renderCheckbox()}
        {this.renderSelector()}
      </div>
    )
  }
}

polyfill(InternelTreeNode)

const ContextTreeNode: React.FC<TreeNodeProps> = props => {
  <TreeContext.Consumer>
    {context => <InternelTreeNode {...props} context={context}/>}
  </TreeContext.Consumer>
}

ContextTreeNode.displayName = 'TreeNode'

ContextTreeNode.defaultProps = {
  title: defaultTitle
}

(ContextTreeNode as any).isTreeNode = 1

export { InternelTreeNode }

export default ContextTreeNode
