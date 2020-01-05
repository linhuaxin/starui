import React from 'react'
import classNames from 'classnames'
import Indent from './Indent'
import { TreeContext } from './contextTypes'
import { InternalTreeNodeProps, TreeNodeProps, TreeNodeState } from './interface'
import { convertNodePropsToEventData } from './utils/treeUtils'

const ICON_OPEN = 'open'
const ICON_CLOSE = 'close'

class TreeNode extends React.Component<InternalTreeNodeProps, TreeNodeState> {

  public state = {
    dragNodeHighlight: false
  }

  public selectHandle: HTMLSpanElement

  setSelectHandle = node => {
    this.selectHandle = node
  }

  getNodeState() {
    const { expanded } = this.props

    if (this.isLeaf()) {
      return null
    }
    return expanded ? ICON_OPEN : ICON_CLOSE
  }

  isCheckable() {
    const {
      checkable,
      context: { checkable: treeCheckable }
    } = this.props

    if (!treeCheckable || checkable === false) return false
    return treeCheckable
  }

  isDisabled() {
    const {
      disabled,
      context: { disabled: treeDisabled }
    } = this.props

    return !!(treeDisabled || disabled)
  }

  isSelectable() {
    const { selectable } = this.props
    const {
      context: { selectable: treeSelectable }
    } = this.props

    if (typeof selectable === 'boolean') {
      return selectable
    }

    return treeSelectable
  }

  hasChildren() {
    const {
      eventKey,
      context: { keyEntities }
    } = this.props

    const { children } = keyEntities[eventKey] || {}
    return !!(children || []).length
  }

  isLeaf() {
    const {
      isLeaf,
      loaded,
      context: { loadData }
    } = this.props

    const hasChildren = this.hasChildren()

    if (isLeaf === false) {
      return false
    }
    return isLeaf || (!loadData && !hasChildren) || (loadData && loaded && !hasChildren)
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

    const {
      checked,
      disableCheckbox,
      context: { onNodeCheck }
    } = this.props

    if (!this.isCheckable() || disableCheckbox) return

    e.preventDefault()
    const targetChecked = !checked
    onNodeCheck(e, convertNodePropsToEventData(this.props), targetChecked)
  }

  onExpand: React.MouseEventHandler<HTMLDivElement> = e => {
    const {
      context: { onNodeExpand }
    } = this.props
    onNodeExpand(e, convertNodePropsToEventData(this.props))
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

  renderSwitcher() {
    const {
      expanded,
      switcherIcon: switcherIconFromProps,
      context: {
        prefixCls,
        switcherIcon: switcherIconFromCtx
      }
    } = this.props

    const switcherIcon = switcherIconFromProps || switcherIconFromCtx

    if (this.isLeaf()) {
      return (
        <span className={classNames(`${prefixCls}-switcher`, `${prefixCls}-switcher-noop`)}>
          {typeof switcherIcon === 'function'
            ? switcherIcon({ ...this.props, isLeaf: true })
            : switcherIcon}
        </span>
      )
    }

    const switcherCls = classNames(
      `${prefixCls}-switcher`,
      `${prefixCls}-switcher_${expanded ? ICON_OPEN : ICON_CLOSE}`
    )

    return (
      <span onClick={this.onExpand} className={switcherCls}>
        {typeof switcherIcon === 'function'
          ? switcherIcon({ ...this.props, isLeaf: false })
          : switcherIcon}
      </span>
    )
  }

  renderCheckbox() {
    const {
      checked,
      halfChecked,
      disableCheckbox,
      context: { prefixCls }
    } = this.props
    const disabled = this.isDisabled()
    const checkable = this.isCheckable()

    if (!checkable) return null

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

  renderIcon() {
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
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        aria-grabbed={(!disabled && draggable) || undefined}
        onClick={this.onSelectorClick}
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
      dragOver,
      dragOverGapTop,
      dragOverGapBottom,
      context: { prefixCls, filterTreeNode, keyEntities, draggable }
    } = this.props

    const { level } = keyEntities[eventKey]
    const disabled = this.isDisabled()

    return (
      <div
        className={classNames(`${prefixCls}-treenode`, {
          [`${prefixCls}-treenode-disabled`]: disabled,
          'drag-over': !disabled && dragOver,
          'drag-over-gap-top': !disabled && dragOverGapTop,
          'drag-over-gap-bottom': !disabled && dragOverGapBottom,
          'filter-node': filterTreeNode && filterTreeNode(convertNodePropsToEventData(this.props))
        })}
        onDragEnter={draggable ? this.onDragEnter : undefined}
        onDragOver={draggable ? this.onDragOver : undefined}
        onDragLeave={draggable ? this.onDragLeave : undefined}
        onDrop={draggable ? this.onDrop : undefined}
        onDragEnd={draggable ? this.onDragEnd : undefined}
      >
        <Indent prefixCls={prefixCls} level={level}/>
        {this.renderSwitcher()}
        {this.renderCheckbox()}
        {this.renderSelector()}
      </div>
    )
  }
}

const ContextTreeNode: React.FC<TreeNodeProps> = props => (
  <TreeContext.Consumer>
    {context => <TreeNode {...props} context={context}/>}
  </TreeContext.Consumer>
)

export default ContextTreeNode
