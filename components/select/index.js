import React, { PureComponent } from 'react'
import { Select } from './style'
import { CSSTransition } from 'react-transition-group'

class SelectComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    let { list } = this.props

    return (
      <Select>
      </Select>
    )
  }
}

export default SelectComponent
