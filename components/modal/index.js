import React, { PureComponent } from 'react'
import Mask from '../mask'
import Button from '../button'
import { Wrapper, Modal, Header, Title, Content, Footer } from './style'
import { CSSTransition } from 'react-transition-group'

class ModalComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      left: 0,
      top: 0
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
    let width = this.modal.offsetWidth
    let height = this.modal.offsetHeight

    this.setState({
      left: clientWidth - width / 2,
      top: clientHeight - height / 2
    })
  }

  render() {
    let { title, children, visible } = this.props

    return (
      <Wrapper visible={visible}>
        <Mask/>
        <CSSTransition
          in={visible}
          timeout={200}
          classNames='modal'
        >
          <Modal
            ref={modal => {
              this.modal = modal
            }}
            left={this.state.left}
            top={this.state.top}
          >
            <Header>
              <Title>{title}</Title>
            </Header>
            <Content>{children}</Content>
            <Footer>
              <Button animate={false} onClick={this.handleCancel.bind(this)}>取消</Button>
              <Button animate={false} type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
            </Footer>
          </Modal>
        </CSSTransition>
      </Wrapper>
    )
  }

  /**
   * 取消事件
   */
  handleCancel() {
    let { onCancel } = this.props
    onCancel && onCancel()
  }

  /**
   * 确认事件
   */
  handleOk() {
    let { onOk } = this.props
    onOk && onOk()
  }
}

export default ModalComponent
