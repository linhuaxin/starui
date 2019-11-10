import React from 'react'
import { useDrop } from 'react-dnd'
import { TreeNode } from './style'
import Node from '../node/'

export default function TreeNodeComponent({ isLeaf, level, id, type, children, handleDrag }) {

  const [{ isOver }, drop] = useDrop({
    accept: 'node',
    drop: (item, e) => handleDrag(item, e, id),
    collect: (monitor) => {
      return {
        isOver: !!monitor.isOver()
      }
    },
  })

  return (
    <TreeNode
      ref={drop}
      isOver={isOver}
    >
      <Node
        id={id}
        isLeaf={isLeaf}
        level={level}
        key={id}
        type={type}
      >{ children }</Node>
    </TreeNode>
  )
}