import Guard from './guard';

export enum Level {
    verbose,
    debug,
    info,
    warn,
    error
}

// note: if you want verbose you need to change this explictly, this is just the initial default
let _currentLevel = Level.debug;

export type MarkerLabels = {[key: string]: string};

export type LogEvent = {
    logger: string,
    level: Level,
    color: string,
    args: IArguments,
    labels: MarkerLabels
}

export interface Sink {
    log(logEvent: LogEvent): void;
}

export class ConsoleSink implements Sink {

    public log(logEvent: LogEvent): void {
        let dateTime = new Date();
        const toLog = [`%c[${dateTime.toLocaleString()}.${dateTime.getMilliseconds()}][${Level[logEvent.level]}][${logEvent.logger}]`, `color:${logEvent.color}`];
        toLog.push.apply(toLog, logEvent.args);
        console.log.apply(console, toLog);
    }
}

export class CompositeSink implements Sink {

    constructor(private _sinks: Array<Sink>) {}

    log(logEvent: LogEvent): void {
        this._sinks.forEach(s => s.log(logEvent));
    }
}

let _sink = new ConsoleSink();

export default class Logger {
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    static create(name: string): Logger {
        Guard.isDefined(name, 'The name argument should be defined');
        Guard.isString(name, 'The name argument should be a string');
        return new Logger(name);
    }

    static setLevel(level: Level): void {
        _currentLevel = level;
    }

    static setSink(sink: Sink): void {
        _sink = sink;
    }

    /**
     * verbose(message [, ...args[, labels]]): expects a string log message, args for console logging, and optional marker labels
     */
    verbose(message: string, args?: any, labels?: MarkerLabels): void {
        if (_currentLevel <= Level.verbose) {
            this._log(Level.verbose, null, arguments, labels);
        }
    }

    /**
     * debug(message [, ...args[, labels]]): expects a string log message, args for console logging, and optional marker labels
     */
    debug(message: string, args?: any, labels?: MarkerLabels): void {
        if (_currentLevel <= Level.debug) {
            this._log(Level.debug, null, arguments, labels);
        }
    }

    /**
     * info(message [, ...args[, labels]]): expects a string log message, args for console logging, and optional marker labels
     */
    info(message: string, args?: any, labels?: MarkerLabels): void {
        if (_currentLevel <= Level.info) {
            this._log(Level.info, 'blue', arguments, labels);
        }
    }

    /**
     * warn(message [, ...args[, labels]]): expects a string log message, args for console logging, and optional marker labels
     */
    warn(message: string, args?: any, labels?: MarkerLabels): void {
        if (_currentLevel <= Level.warn) {
            this._log(Level.warn, 'orange', arguments, labels);
        }
    }

    /**
     * error(message [, ...args[, labels]]): expects a string log message, args for console logging, and optional marker labels
     */
    error(message: string, args?: any, labels?: MarkerLabels): void {
        if (_currentLevel <= Level.error) {
            this._log(Level.error, 'red', arguments, labels);
        }
    }

    private _log(level: Level, color: string | null, args: IArguments, labels?: MarkerLabels): void {
        _sink.log({
            logger: this._name,
            level: level,
            color: color || 'black',
            args: args,
            labels: labels || {}
         });
    }
}
