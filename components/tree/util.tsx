import {TreeNodeProps} from './TreeNode'

export function getDataAndAria(props: Partial<TreeNodeProps>) {
  const omitProps: Record<string, string> = {}
  Object.keys(props).forEach(key => {
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      omitProps[key] = props[key]
    }
  })

  return omitProps
}
