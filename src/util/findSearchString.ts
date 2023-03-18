export const findFirstOf = (line: string, list: string[]): number | null => {
  for (const c of list) {
    const position = line.indexOf(c)
    if (position !== -1) {
      return position
    }
  }
  return null
}

export const findLastOf = (line: string, list: string[]): number | null => {
  for (const c of list) {
    const position = line.lastIndexOf(c)
    if (position !== -1) {
      return position
    }
  }
  return null
}
