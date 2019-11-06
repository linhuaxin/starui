import React, { PureComponent } from 'react'
import { CheckBox } from './style'

class CheckBoxComponent extends PureComponent {
  render() {
    <CheckBox>
      123
    </CheckBox>
  }

  /**
   * 点击事件
   */
  handleClick() {
    let { onClick } = this.props
    onClick && onClick()
  }
}

export default CheckBoxComponent
