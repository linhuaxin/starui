import * as React from 'react'
import classNames from 'classnames'

interface IndentProps {
  prefixCls: string
  level: number
  isStart?: boolean[]
  isEnd?: boolean[]
}

const Indent: React.FC<IndentProps> = ({ prefixCls, level, isStart, isEnd }) => {
  if (!level) {
    return null
  }

  const baseClassName = `${prefixCls}-indent-unit`
  const list: React.ReactElement[] = []

  for (let i = 0; i < level; i++) {
    list.push(
      <span
        key={i}
        className={classNames(baseClassName)}
      />
    )
  }

  return (
    <span aria-hidden="true" className={`${prefixCls}-indent`}>
      {list}
    </span>
  )
}

export default Indent
