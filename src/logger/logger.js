/**
 * @file logger.js
 * @namespace logger
 * @author Mrunal
 * Created Date: 01/18/2020
 * @description Logger
 */
const log4js = require('log4js');
log4js.configure({
    appenders: {
        out: {
            type: 'stdout'
        },
        app: {
            type: 'file',
            filename: 'app.log',
            maxLogSize: 10485760,
            backups: 1,
            compress: true
        }
    },
    categories: {
        default: {
            appenders: ['out', 'app'],
            level: 'debug'
        }
    }
});

const logger = log4js.getLogger();
logger.debug('Logger Level On : ', 'debug');
module.exports = logger;
