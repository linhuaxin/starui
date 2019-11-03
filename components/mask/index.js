import React, { PureComponent } from 'react'
import { Mask } from './style'

class MaskComponent extends PureComponent {
  render() {
    let { showBg = true } = this.props

    return <Mask
      showBg={showBg}
    />
  }
}

export default MaskComponent
