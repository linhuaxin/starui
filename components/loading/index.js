import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Mask from '../mask'
import { Wrapper, LoadingWrapper, Icon } from './style'

class LoadingComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      left: 0,
      top: 0,
      visible: false
    }
  }

  componentDidMount() {
    this.computePosition()
    window.addEventListener('resize', () => {
      this.computePosition()
    })
  }

  /**
   * 计算弹出框位置
   */
  computePosition() {
    let clientWidth = document.documentElement.clientWidth / 2
    let clientHeight = document.documentElement.clientHeight / 2
    let width = this.loading.offsetWidth
    let height = this.loading.offsetHeight

    this.setState({
      left: clientWidth - width / 2,
      top: clientHeight - height / 2
    })
  }

  render() {
    let { visible } = this.state

    return (
      <Wrapper visible={visible}>
        <Mask showBg={false} />
        <LoadingWrapper
          ref={loading => {
            this.loading = loading
          }}
          left={this.state.left}
          top={this.state.top}
        >
          <Icon className="icon" aria-hidden="true">
            <use href="#iconloading"></use>
          </Icon>
        </LoadingWrapper>
      </Wrapper>
    )
  }

  open() {
    this.setState({
      visible: true
    })
  }

  close() {
    this.setState({
      visible: false
    })
  }
}

let div = document.createElement('div')
document.body.appendChild(div)

export default ReactDOM.render(<LoadingComponent />, div)