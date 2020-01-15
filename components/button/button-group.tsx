import * as React from 'react';
import classNames from 'classnames';
import { ButtonSize } from './button';

export interface ButtonGroupProps {
  size?: ButtonSize;
  style?: React.CSSProperties;
  className?: string;
  prefixCls?: string;
}

const ButtonGroup: React.SFC<ButtonGroupProps> = props => {
  const { prefixCls: customizePrefixCls, size, className, ...others } = props;
  const prefixCls = 'ant-btn-group';

  // large => lg
  // small => sm
  let sizeCls = '';
  switch (size) {
    case 'large':
      sizeCls = 'lg';
      break;
    case 'small':
      sizeCls = 'sm';
      break;
    default:
      break;
  }

  const classes = classNames(
    prefixCls,
    {
      [`${prefixCls}-${sizeCls}`]: sizeCls,
    },
    className,
  );

  return <div {...others} className={classes} />;
};

export default ButtonGroup;
