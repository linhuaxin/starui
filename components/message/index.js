import React, { PureComponent } from 'react'
import { Content, ContentWrapper, Icon, Message } from './style'
import { CSSTransition } from 'react-transition-group'
import ReactDOM from 'react-dom'

class MessageComponent extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      duration: 2000,
      visible: false,
      content: ''
    }
  }

  render() {
    let { visible, content, type } = this.state

    return (
      <CSSTransition
        in={visible}
        timeout={200}
        classNames='message'
      >
        <Message visible={visible}>
          <ContentWrapper>
            <Icon className="icon" aria-hidden="true">
              <use href={ '#icon' + type }></use>
            </Icon>
            <Content>{content}</Content>
          </ContentWrapper>
        </Message>
      </CSSTransition>
    )
  }

  msg(content, type) {
    this.setState({
      visible: true,
      content,
      type
    })
    setTimeout(() => {
      this.setState({
        visible: false
      })
    }, this.state.duration)
  }

  info(content) {
    this.msg(content, 'info')
  }

  warning(content) {
    this.msg(content, 'warning')
  }

  error(content) {
    this.msg(content, 'error')
  }

  success(content) {
    this.msg(content, 'success')
  }
}

let div = document.createElement('div')
document.body.appendChild(div)

export default ReactDOM.render(<MessageComponent/>, div)
