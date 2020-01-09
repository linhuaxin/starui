import React from 'react'

function noop() {
}

interface AnimationProps {
  className?: string
  style?: React.CSSProperties
  component?: any
  componentProps?: object
  animation?: object
  transitionName?: string | object
  transitionEnter?: boolean
  transitionAppear?: boolean
  exclusive?: boolean
  transitionLeave?: boolean
  showProp?: string
  children?: any
  onEnd?: any
  onEnter?: any
  onLeave?: any
  onAppear?: any
}

class Animate extends React.Component<AnimationProps, any> {

  static defaultProps = {
    component: 'span',
    componentProps: {},
    animation: {},
    transitionEnter: true,
    transitionLeave: true,
    transitionAppear: false,
    onEnd: noop,
    onEnter: noop,
    onLeave: noop,
    onAppear: noop,
  }
}

export default Animate
