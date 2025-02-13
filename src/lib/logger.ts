import {
    format,
    createLogger,
    transports,
    Logger as WinstonLogger
} from 'winston';

interface LogConfig {
    message: string;
    service?: string;
    method?: string;
    details?: string;
    stack?: string;
    cacheLog?: boolean;
    cacheState?: 'HIT' | 'MISS';
    level?: 'info' | 'warn' | 'error';
}

class Logger {
    private logger: WinstonLogger;

    constructor() {
        const consoleFormat = format.printf(
            ({ level, message, service, method, details, timestamp, cacheLog, cacheState }) => {
                if (typeof message === 'object') {
                    message = JSON.stringify(message, null, 2);
                }

                if (typeof details === 'object') {
                    details = JSON.stringify(details, null, 2);
                }

                let msg = `${timestamp} ${level}:`;
                if (service) msg += ` [${service}]`;
                if (method) msg += `(${method})`;
                if (cacheLog) msg += `[CACHE]`;
                if (cacheState) msg += `[CACHE ${cacheState}]`;
                if (message) msg += ` ${message}`;
                if (details) msg += ` (details: ${details})`;

                return msg;
            }
        );

        this.logger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp()),
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.prettyPrint(),
                        format.json(),
                        consoleFormat
                    ),
                }),
                new transports.File({
                    format: format.combine(format.json()),
                    filename: `logs/debug-${new Date().toLocaleDateString}.log`
                }),
            ],
        });
    }

    /**
     * Logs an informational message.
     * 
     * @param {LogConfig} config - The configuration object.
     */
    info(config: LogConfig): void {
        this.logger.info(config.message, {
            service: config.service,
            method: config.method,
            details: config.details
        });
    }

    /**
     * Logs a warning message.
     *
     * @param {LogConfig} config - The configuration object.
     */
    warn(config: LogConfig): void {
        this.logger.warn(config.message, {
            service: config.service,
            method: config.method,
            details: config.details
        });
    }

    /**
     * Logs an error message.
     * 
     * @param {LogConfig} config - The configuration object.
     */
    error(config: LogConfig): void {
        this.logger.error(config.message, {
            service: config.service,
            method: config.method,
            details: config.details,
            stack: config.stack
        });
    }

    /**
     * Logs a fatal message and kills the process.
     * 
     * @param {LogConfig} config - The configuration object.
     */
    fatal(config: LogConfig): void {
        this.logger.error(config.message, {
            service: config.service,
            method: config.method,
            details: config.details,
            stack: config.stack
        });

        return process.exit(1);
    }

    /**
     * Logs a cache message.
     * 
     * @param {LogConfig} config - The configuration object.
     */
    /**
     * Logs a cache message.
     * 
     * @param {LogConfig} config - The configuration object.
     */
    cache(config: LogConfig): void {

        if (config.cacheState === 'MISS') {
            this.logger.warn(config.message, {
                service: config.service,
                method: config.method,
                details: config.details,
                cache: config.cacheState
            })
        }

        const level = config.level || 'info';
        this.logger.log(level, config.message, {
            service: config.service,
            method: config.method,
            details: config.details,
            cache: config.cacheState
        });
    }
}

const logger = new Logger();

export { Logger };
export default logger;