import React from 'react'
import ReactDOM from 'react-dom'
import cssAnimate, { isCssAnimationSupported } from 'css-animation'
import animUtil from './util/animate'

interface AnimateChildProps {
  children?: any
  animation?: any
  transitionName?: any
}

export default class AnimateChild extends React.Component<AnimateChildProps, any> {

  componentWillUnmount() {
  }

  componentWillEnter(done) {
    if (animUtil.isEnterSupported(this.props)) {
    }
  }

  transition(animationType, finishCallBack) {
    const node = ReactDOM.findDOMNode(this);
    const props = this.props;

  }
}
