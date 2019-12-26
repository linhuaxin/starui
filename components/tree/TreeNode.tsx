import React from 'react'
import classNames from 'classnames'
import Indent from './Indent'
import { TreeContext } from './contextTypes'
import { InternalTreeNodeProps, TreeNodeProps, TreeNodeState } from './interface'
import { convertNodePropsToEventData } from './utils/treeUtils'

class TreeNode extends React.Component<InternalTreeNodeProps, TreeNodeState> {

  isCheckable() {
    const {
      checkable,
      context: { checkable: treeCheckable }
    } = this.props

    if (!treeCheckable || checkable === false) return false
    return treeCheckable
  }

  onCheck = e => {
    const {
      checked,
      context: { onNodeCheck }
    } = this.props

    e.preventDefault()
    const targetChecked = !checked
    onNodeCheck(e, convertNodePropsToEventData(this.props), targetChecked)
  }

  renderCheckbox() {
    const {
      context: { prefixCls }
    } = this.props
    const checkable = this.isCheckable()

    if (!checkable) return null

    return (
      <span
        className={classNames(`${prefixCls}-checkbox`)}
        onClick={this.onCheck}
      />
    )
  }

  renderSelector() {
    const {
      title,
      context: { prefixCls }
    } = this.props
    const $title = (
      <span className={`${prefixCls}-title`}>
        {title}
      </span>
    )
    return (
      <>
        {$title}
      </>
    )
  }

  render() {
    const {
      level,
      context: { prefixCls }
    } = this.props
    return (
      <div
        className={classNames(
          `${prefixCls}-treenode`
        )}
      >
        <Indent prefixCls={prefixCls} level={level} />
        {this.renderCheckbox()}
        {this.renderSelector()}
      </div>
    )
  }
}

const ContextTreeNode: React.FC<TreeNodeProps> = props => (
  <TreeContext.Consumer>
    {context => <TreeNode {...props} context={context} />}
  </TreeContext.Consumer>
)

export default ContextTreeNode
