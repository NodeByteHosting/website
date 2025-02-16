import {
    ILogger,
    BaseLogConfig,
    CacheLogConfig,
    InternalLogConfig,
    LogLevel,
    CacheState
} from 'types/logger';

export class Logger implements ILogger {
    private static instance: Logger;
    private readonly isDevelopment: boolean;
    private readonly logLevels: Record<LogLevel, string> = {
        info: '🔵',
        warn: '🟡',
        error: '🔴'
    };

    private readonly cacheStates: Record<CacheState, string> = {
        HIT: '✅',
        MISS: '❌',
        SET: '💾',
        EXPIRED: '⏰',
        EVICT: '🗑️',
        CLEANUP: '🧹',
        ERROR: '💥'
    };

    private constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private formatMessage(config: InternalLogConfig): string {
        const timestamp = new Date().toISOString();
        const level = config.level || 'info';
        const emoji = config.cacheLog
            ? this.cacheStates[config.cacheState!]
            : this.logLevels[level];

        return `${emoji} [${timestamp}] [${config.service}] ${config.message}${config.method ? ` (${config.method})` : ''
            }`;
    }

    private logToConsole(config: InternalLogConfig): void {
        if (!this.isDevelopment) return;

        const formattedMessage = this.formatMessage(config);
        const level = config.level || 'info';

        switch (level) {
            case 'info':
                console.log(formattedMessage);
                break;
            case 'warn':
                console.warn(formattedMessage);
                break;
            case 'error':
                console.error(formattedMessage);
                break;
        }

        if (config.details) {
            console.dir(config.details, { depth: null, colors: true });
        }
    }

    public log(config: BaseLogConfig): void {
        this.logToConsole({
            ...config,
            level: config.level || 'info'
        });
    }

    public info(service: string, message: string, ...details: unknown[]): void {
        this.logToConsole({
            service,
            message,
            details: details.length ? details : undefined,
            level: 'info'
        });
    }

    public warn(service: string, message: string, ...details: unknown[]): void {
        this.logToConsole({
            service,
            message,
            details: details.length ? details : undefined,
            level: 'warn'
        });
    }

    public error(service: string, message: string, error?: Error | unknown): void {
        this.logToConsole({
            service,
            message,
            details: error,
            level: 'error'
        });
    }

    public cache(config: CacheLogConfig): void {
        this.logToConsole({
            service: config.service || 'Cache',
            message: config.message || `Cache ${config.cacheState}`,
            details: config.details,
            level: config.level || 'info',
            cacheLog: true,
            cacheState: config.cacheState
        });
    }
}

export const logger = Logger.getInstance();