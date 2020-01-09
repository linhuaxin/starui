import React from 'react'
import classNames from 'classnames'

interface NoticeProps {
  duration: number
  onClose: any
  children: any
  update: boolean
  closeIcon: any
  prefixCls: string
  closable: false
  className: string
  onClick: React.MouseEventHandler
  style: React.CSSProperties
}

export default class Notice extends React.Component<NoticeProps> {

  closeTimer: any

  static defaultProps = {
    onEnd() {
    },
    onClose() {
    },
    duration: 1.5,
    style: {
      right: '50%',
    },
  };

  componentDidMount() {
    this.startCloseTimer();
  }

  componentDidUpdate(prevProps) {
    if (this.props.duration !== prevProps.duration
      || this.props.update) {
      this.restartCloseTimer();
    }
  }

  componentWillUnmount() {
    this.clearCloseTimer();
  }

  close = (e?) => {
    if (e) {
      e.stopPropagation();
    }
    this.clearCloseTimer();
    this.props.onClose();
  }

  startCloseTimer = () => {
    if (this.props.duration) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, this.props.duration * 1000);
    }
  }

  clearCloseTimer = () => {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  restartCloseTimer() {
    this.clearCloseTimer();
    this.startCloseTimer();
  }

  render() {
    const props = this.props;
    const componentClass = `${props.prefixCls}-notice`;
    const className = {
      [`${componentClass}`]: 1,
      [`${componentClass}-closable`]: props.closable,
      [props.className]: !!props.className,
    };
    return (
      <div
        className={classNames(className)}
        style={props.style}
        onMouseEnter={this.clearCloseTimer}
        onMouseLeave={this.startCloseTimer}
        onClick={props.onClick}
      >
        <div className={`${componentClass}-content`}>{props.children}</div>
        {props.closable ?
          <a tabIndex={0} onClick={this.close} className={`${componentClass}-close`}>
            {props.closeIcon || <span className={`${componentClass}-close-x`}/>}
          </a> : null
        }
      </div>
    );
  }
}
