import React, { PureComponent } from 'react'
import { DefaultButton, PrimaryButton } from './style'

class ButtonComponent extends PureComponent {
  render() {
    let { children, type, block, animate = true } = this.props
    let parentWidth = block ? 'parent-width' : ''

    switch (type) {
      case 'primary':
        return <PrimaryButton
          animate={animate}
          onClick={this.handleClick.bind(this)}
          className={ parentWidth }>{ children }</PrimaryButton>
      default:
        return <DefaultButton
          animate={animate}
          onClick={this.handleClick.bind(this)}>{ children }</DefaultButton>
    }
  }

  /**
   * 点击事件
   */
  handleClick() {
    let { onClick } = this.props
    onClick && onClick()
  }
}

export default ButtonComponent
