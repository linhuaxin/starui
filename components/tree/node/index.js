import React from 'react'
import { useDrag } from 'react-dnd'
import { Node } from './style'

export default function NodeComponent({ isLeaf, level, id, type, children }) {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: 'node',
      id: id
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  })

  return (
    <Node
      ref={drag}
      isDragging={isDragging}
      className={isLeaf ? '' : type}
      level={level}
      key={id}
    >{children}</Node>
  )
}
