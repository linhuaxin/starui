import React, {Component, CSSProperties} from 'react'
import classNames from "classnames";

export type CheckboxChangeEventHandler = (checked: boolean, event: MouseEvent) => void

interface CheckboxProps {
  prefixCls?: string
  className?: string
  style?: CSSProperties
  defaultChecked?: boolean
  checked?: boolean
  disabled?: boolean
  readOnly?: boolean
  autoFocus?: boolean
  value?: any
  onFocus?: any
  onBlur?: any
  onChange?: CheckboxChangeEventHandler
  onClick?: any
}

interface CheckboxState {
  checked: boolean
}

class Checkbox extends Component<CheckboxProps, CheckboxState> {
  private node: React.RefObject<HTMLInputElement>

  static defaultProps = {
    prefixCls: 'rc-checkbox',
    className: '',
    style: {},
    type: 'checkbox'
  }

  constructor(props) {
    super(props)
    const checked = 'checked' in props ? props.checked : !!props.defaultChecked
    this.state = { checked }
    this.node = React.createRef()
  }

  static getDerivedStateFromProps(props, state) {
    if ('checked' in props) {
      return {
        ...state,
        checked: props.checked
      }
    }
    return null
  }

  focus() {
    if (this.node.current) {
      this.node.current.focus()
    }
  }

  blur() {
    if (this.node.current) {
      this.node.current.blur()
    }
  }

  handleChange = e => {
    const checked = e.target.checked
    const {disabled, onChange} = this.props
    if (disabled) {
      return
    }
    if (!('checked' in this.props)) {
      this.setState({
        checked
      })
    }
    if (onChange) {
      onChange(checked, e)
    }
  }

  render() {
    const {
      prefixCls,
      className,
      style,
      disabled,
      readOnly,
      onClick,
      onFocus,
      onBlur,
      autoFocus,
      value,
      ...restProps
    } = this.props

    const { checked } = this.state
    const checkboxClassName = classNames(prefixCls, className, {
      [`${prefixCls}-checked`]: checked,
      [`${prefixCls}-disabled`]: disabled
    })

    return (
      <span className={checkboxClassName} style={style}>
        <input
          {...restProps}
          ref={this.node}
          className={`${prefixCls}-input`}
          readOnly={readOnly}
          disabled={disabled}
          checked={checked}
          autoFocus={autoFocus}
          value={value}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={this.handleChange}
        />
        <span className={`${prefixCls}-inner`} />
      </span>
    )
  }
}

export default Checkbox
