import Guard from './guard';
import Utils from './utils';

export enum Level {
    verbose,
    debug,
    info,
    warn,
    error,
    none
};

export type Markers = {[key:string]: string};

export type LogEvent = {
    timestamp: Date,
    logger: string,
    level: Level,
    color: string,
    message: string;
    additionalDetails: any[];
    markers: Markers;
}

export interface Sink {
    log(logEvent:LogEvent): void;
}

export class ConsoleSink implements Sink {
    public log(logEvent: LogEvent) : void {
        let dateTime = new Date();
        let message = `[${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}.${dateTime.getMilliseconds()}][${Level[logEvent.level]}][${logEvent.logger}] ${logEvent.message}`;
        if(logEvent.markers && Object.keys(logEvent.markers).length) {
            console.log(message, logEvent.markers, ...logEvent.additionalDetails);
        } else {
            console.log(message, ...logEvent.additionalDetails);
        }
    };
}

export class CompositeSink implements Sink {
    private _sinks: Array<Sink>;
    
    constructor(...sinks: Array<Sink>) {
        this._sinks = sinks;
    }
    public log(logEvent: LogEvent) : void {
        this._sinks.forEach(s => s.log(logEvent));
    }
    public addSinks(...sinks:Array<Sink>) {
        this._sinks.push(...sinks);
    }
}

// note: if you want verbose you need to change this explictly, this is just the initial default
let _currentLevel = Level.debug;

let _sink = new CompositeSink(new ConsoleSink());

export class LoggingConfig {
    static setLevel(level: Level): void {
        _currentLevel = level;
    }

    static addSinks(...sink: Array<Sink>): void {
        _sink.addSinks(...sink);
    }

}
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

    /**
     * verbose(message [, ...args]): expects a string log message and optional object to dump to console
     */
    verbose(message: string, additionalDetails?: any): void;
    verbose(markers:Markers, message: string, additionalDetails?: any): void;
    verbose(...args: any[]) : void {
        if (_currentLevel <= Level.verbose) {
            this._log(Level.verbose, null, args);
        }
    }

    /**
     * debug(message [, ...args]): expects a string log message and optional object to dump to console
     */
    debug(message: string, additionalDetails?: any): void;
    debug(markers:Markers, message: string, additionalDetails?: any): void;
    debug(...args: any[]) : void {
        if (_currentLevel <= Level.debug) {
            this._log(Level.debug, null, args);
        }
    }

    /**
     * info(message [, ...args]): expects a string log message and optional object to dump to console
     */
    info(message: string, additionalDetails?: any): void;
    info(markers:Markers, message: string, additionalDetails?: any): void;
    info(...args: any[]) : void {
        if (_currentLevel <= Level.info) {
            this._log(Level.info, 'blue', args);
        }
    }

    /**
     * warn(message [, ...args]): expects a string log message and optional object to dump to console
     */
    warn(message: string, additionalDetails?: any): void;
    warn(markers:Markers, message: string, additionalDetails?: any): void;
    warn(...args: any[]) : void {
        if (_currentLevel <= Level.warn) {
            this._log(Level.warn, 'orange', args);
        }
    }

    /**
     * error(message [, ...args]): expects a string log message and optional object to dump to console
     */
    error(message: string, additionalDetails?: any): void;
    error(markers:Markers, message: string, additionalDetails?: any): void;
    error(...args: any[]) : void {
        if (_currentLevel <= Level.error) {
            this._log(Level.error, 'red', args);
        }
    }

    private _log(level: Level, color: string | null, args: any[]): void {

        let markers : Markers = {};
        let message : string;
        let additionalDetails : any[];

        if(!Utils.isString(args[0])) {
            markers = args[0];
            message = args[1];
            additionalDetails = args.splice(2, args.length - 2);
        } else {
            message = args[0];
            additionalDetails = args.splice(1, args.length - 1);
        }

        _sink.log({
            timestamp: new Date(),
            logger: this._name,
            level: level,
            color: color || 'black',
            message: message,
            additionalDetails: additionalDetails,
            markers: markers
         });
    }
}
