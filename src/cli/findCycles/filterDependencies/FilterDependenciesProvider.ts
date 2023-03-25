import { FilterDependencies } from './FilterDependencies'
import { FilterDependenciesImpl } from './FilterDependenciesImpl'

export const getFilterDependencies = (): FilterDependencies => {
  return new FilterDependenciesImpl()
}
