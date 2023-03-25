import { DotFileBuilder } from './DotFileBuilder'
import { DotFileBuilderImpl } from './DotFileBuilderImpl'

export const getDotFileBuilder = (): DotFileBuilder => {
  return new DotFileBuilderImpl()
}
