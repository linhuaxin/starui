import { DataNode, FlattenNode } from '../interface'

export function flattenTreeData(
  treeData: DataNode[] = []
): FlattenNode[] {
  const flattenList: FlattenNode[] = []

  function dig(list: DataNode[], parent: FlattenNode = null): FlattenNode[] {
    return list.map((treeNode, index) => {
      const flattenNode = {
        ...treeNode,
        parent,
        children: [],
        data: treeNode,
        isStart: [...(parent ? parent.isStart : []), index === 0],
        isEnd: [...(parent ? parent.isEnd : []), index === list.length - 1]
      }

      flattenList.push(flattenNode)
      flattenNode.children = dig(treeNode.children || [], flattenNode)
      return flattenNode
    })
  }

  dig(treeData)
  return flattenList
}
