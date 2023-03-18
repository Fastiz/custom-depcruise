import { Logger } from '../logger/Logger'
import { FileRepository } from '../repository/FileRepository'
import { DependencyTreeService } from '../service/dependencytree/DependencyTreeService'
import { RuleViolationService } from '../service/ruleviolation/RuleViolationService'
import { getLogger } from '../logger/LoggerProvider'
import { getFileRepository } from '../repository/FileRepositoryProvider'
import { getDependencyTreeService } from '../service/dependencytree/DependencyTreeServiceProvider'
import { getRuleViolationService } from '../service/ruleviolation/RuleViolationServiceProvider'

type Dependencies = {
  logger: Logger
  fileRepository: FileRepository
  dependencyTreeService: DependencyTreeService
  ruleViolationService: RuleViolationService
}

class IocContainer {
  private dependencies: Dependencies | null = null

  public initialize = (dependencies: Partial<Dependencies>) => {
    const rootDirectory = process.cwd()

    const logger = dependencies.logger ?? getLogger()
    const fileRepository = dependencies.fileRepository ?? getFileRepository(logger)
    const dependencyTreeService = dependencies.dependencyTreeService ?? getDependencyTreeService(rootDirectory, fileRepository)
    const ruleViolationService = dependencies.ruleViolationService ?? getRuleViolationService()

    this.dependencies = {
      logger,
      fileRepository,
      dependencyTreeService,
      ruleViolationService,
    }
  }

  public get = (): Dependencies => {
    if (this.dependencies === null) {
      throw Error('The IoC container was not initialized')
    }

    return this.dependencies
  }
}

export const iocContainer = new IocContainer()
