import React, { PureComponent } from 'react'
import { Wrapper, Checkbox, Content, Input, CheckInner } from './style'

class CheckboxComponent extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    let { children } = this.props
    let { checked } = this.state

    if (typeof checked === 'undefined') {
      this.state.checked = checked = this.props.checked
    }

    return (
      <Wrapper>
        <Checkbox>
          <Input onChange={this.checkChange.bind(this)} />
          <CheckInner checked={checked} />
        </Checkbox>
        <Content>{ children }</Content>
      </Wrapper>
    )
  }

  /**
   * 点击事件
   */
  checkChange(e) {
    let checked = !e.target.checked
    this.setState({ checked })
    let { onChange } = this.props
    onChange && onChange(checked)
  }
}

export default CheckboxComponent
