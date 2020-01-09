import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Animate from 'rc-animate'
import createChainedFunction from 'rc-util/lib/createChainedFunction'
import Notice from './Notice'

let seed = 0
const now = Date.now()

function getUuid() {
  return `rcNotification_${now}_${seed++}`
}

interface NotificationProps {
  prefixCls: string
  transitionName: string
  animation: string | object
  style: React.CSSProperties
  maxCount: number
  closeIcon: React.ReactNode
  className: string
}

class Notification extends React.Component<NotificationProps, any>{

  static newInstance

  static defaultProps = {
    prefixCls: 'rc-notification',
    transitionName: 'fade',
    style: {
      top: 65,
      left: '50%'
    }
  }

  state = {
    notices: []
  }

  getTransitionName() {
    const props = this.props;
    let transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = `${props.prefixCls}-${props.animation}`;
    }
    return transitionName;
  }

  add = (notice) => {
    const key = notice.key = notice.key || getUuid();
    const { maxCount } = this.props;
    this.setState(previousState => {
      const notices = previousState.notices;
      const noticeIndex = notices.map(v => v.key).indexOf(key);
      const updatedNotices = notices.concat();
      if (noticeIndex !== -1) {
        updatedNotices.splice(noticeIndex, 1, notice);
      } else {
        if (maxCount && notices.length >= maxCount) {
          // XXX, use key of first item to update new added (let React to move exsiting
          // instead of remove and mount). Same key was used before for both a) external
          // manual control and b) internal react 'key' prop , which is not that good.
          notice.updateKey = updatedNotices[0].updateKey || updatedNotices[0].key;
          updatedNotices.shift();
        }
        updatedNotices.push(notice);
      }
      return {
        notices: updatedNotices,
      };
    });
  }

  remove = (key) => {
    this.setState(previousState => {
      return {
        notices: previousState.notices.filter(notice => notice.key !== key),
      };
    });
  }

  render() {
    const props = this.props;
    const { notices } = this.state;
    const noticeNodes = notices.map((notice, index) => {
      const update = Boolean(index === notices.length - 1 && notice.updateKey);
      const key = notice.updateKey ? notice.updateKey : notice.key;
      const onClose = createChainedFunction(this.remove.bind(this, notice.key), notice.onClose);
      return (<Notice
        prefixCls={props.prefixCls}
        closeIcon={props.closeIcon}
        {...notice}
        key={key}
        update={update}
        onClose={onClose}
        onClick={notice.onClick}
      >
        {notice.content}
      </Notice>);
    });
    const className = {
      [props.prefixCls]: 1,
      [props.className]: !!props.className,
    };
    return (
      <div className={classNames(className)} style={props.style}>
        <Animate transitionName={this.getTransitionName()}>{noticeNodes}</Animate>
      </div>
    );
  }
}

Notification.newInstance = function newNotificationInstance(properties, callback) {
  const { getContainer, ...props } = properties || {};
  const div = document.createElement('div');
  if (getContainer) {
    const root = getContainer();
    root.appendChild(div);
  } else {
    document.body.appendChild(div);
  }
  let called = false;
  function ref(notification) {
    if (called) {
      return;
    }
    called = true;
    callback({
      notice(noticeProps) {
        notification.add(noticeProps);
      },
      removeNotice(key) {
        notification.remove(key);
      },
      component: notification,
      destroy() {
        ReactDOM.unmountComponentAtNode(div);
        div.parentNode.removeChild(div);
      },
    });
  }
  ReactDOM.render(<Notification {...props} ref={ref} />, div);
}

export default Notification
