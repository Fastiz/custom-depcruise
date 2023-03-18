export class LoggerImpl implements LoggerImpl {
  info = (text: string) => {
    console.log(`(info): ${text}`)
  }

  warn = (text: string) => {
    console.warn(`(warn): ${text}`)
  }

  error = (text: string) => {
    console.error(`(error): ${text}`)
  }
}
