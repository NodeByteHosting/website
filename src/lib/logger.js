class Logger {
    constructor() {
        this.logLevel = 'info';
    }

    formatMessage(config) {
        const { message, service, details, cacheLog, cacheState } = config;
        const timestamp = new Date().toISOString();

        let msg = `${timestamp}:`;
        if (service) msg += ` [${service}]`;
        if (cacheLog) msg += `[CACHE]`;
        if (cacheState) msg += `[${cacheState}]`;
        if (message) msg += ` ${message}`;
        if (details) msg += ` (details: ${details})`;

        return msg;
    }

    getColor(level) {
        switch (level) {
            case 'info':
                return '\x1b[32m'; // Green
            case 'warn':
                return '\x1b[33m'; // Yellow
            case 'error':
                return '\x1b[31m'; // Red
            default:
                return '\x1b[0m'; // Reset
        }
    }

    logToConsole(message, level) {
        const color = this.getColor(level);
        console.log(`${color}${message}\x1b[0m`);
    }

    log(config) {
        const message = this.formatMessage(config);
        this.logToConsole(message, config.level);
    }

    /**
     * Logs an informational message.
     * 
     * @param {Object} config - The configuration object.
     */
    info(config) {
        config.level = 'info';
        this.log(config);
    }

    /**
     * Logs a warning message.
     *
     * @param {Object} config - The configuration object.
     */
    warn(config) {
        config.level = 'warn';
        this.log(config);
    }

    /**
     * Logs an error message.
     * 
     * @param {Object} config - The configuration object.
     */
    error(config) {
        config.level = 'error';
        this.log(config);
    }

    /**
     * Logs a fatal message and kills the process.
     * 
     * @param {Object} config - The configuration object.
     */
    fatal(config) {
        config.level = 'error';
        this.log(config);
        process.exit(1);
    }

    /**
     * Logs a cache message.
     * 
     * @param {Object} config - The configuration object.
     */
    cache(config) {
        const level = config.level || 'info';
        config.level = level;
        this.log(config);
    }
}

const logger = new Logger();

module.exports = { Logger, default: logger };