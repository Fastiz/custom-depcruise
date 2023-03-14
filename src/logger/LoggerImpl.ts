export class LoggerImpl implements LoggerImpl {
    info = (text: string) => {
        console.log(text)
    }

    warn = (text: string) => {
        console.warn(text)
    }

    error = (text: string) => {
        console.error(text)
    }
}