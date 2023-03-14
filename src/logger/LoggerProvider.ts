import {Logger} from "src/logger/Logger";
import {LoggerImpl} from "src/logger/LoggerImpl";

export const getLogger = (): Logger => {
    return new LoggerImpl()
}