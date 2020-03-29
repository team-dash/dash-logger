'use strict';


const winston = require('winston');
const { createLogger, format } = require('winston');
const { timestamp, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file');
const Util = require('../util');
const os = require('os');

const globalWinstonInstance = {};
const globalTransports = {};


const loggerFormat = printf(({ message, level }) => {

  const timestamp = Util.Date.getISODate(Date.now());

  // 处理多行message
  message = message ? message.replace(/\r\n|\r|\n/g, `${os.EOL} | `) : message;

  return `${timestamp} ${level} ${message}`;
});


function setLevel(level) {
  const keys = Object.keys(globalTransports);
  for (let i = 0; i < keys.length; i++) {
    const curKey = keys[i];
    for (const transport in globalTransports[curKey]) {
      globalTransports[curKey][transport].level = level;
      // console.log('transport:', transport, 'level', level);
    }
  }
}


process.on('SIGUSR1', function() {
  console.log('SIGUSR1, set debug');
  setLevel('debug');
});

process.on('SIGUSR2', function() {
  console.log('SIGUSR2, set info');
  setLevel('info');
});


class Winston {

  constructor(options) {

    let datePattern;
    if (options.datePattern !== undefined) {
      datePattern = options.datePattern;
    } else {
      datePattern = 'YYYYMMDD-';
    }

    let isDatePrefix;
    if (options.hasOwnProperty('isDatePrefix') && options.isDatePrefix === false) {
      isDatePrefix = options.isDatePrefix;
    } else {
      isDatePrefix = true;
    }

    let filename;
    if (isDatePrefix === true) {
      filename = `%DATE%${options.filename}`;
    } else {
      filename = `${options.filename}%DATE%`;
    }

    globalTransports[options.name] = [];

    if (!options.closeFile) {
      const appTransport = new DailyRotateFile({
        localTime: true,
        name: `${options.name}`,
        dirname: options.dir,
        filename: `${filename}.log`,
        datePattern,
        json: false,
        timestamp,
        level: options.level,
        console: options.console,
        format: loggerFormat
      });

      globalTransports[options.name].push(appTransport);
    }

    if (options.console) {
      const consoleTransport = new winston.transports.Console({
        localTime: true,
        colorize: true,
        json: false,
        level: options.level,
        timestamp,
        format: loggerFormat
      });

      globalTransports[options.name].push(consoleTransport);
    }

    if (options.needErrorFile) {
      const errTransport = new DailyRotateFile({
        localTime: true,
        name: `${options.filename}-error`,
        dirname: options.dir,
        filename: `${filename}-error.log`,
        datePattern,
        json: false,
        timestamp,
        humanReadableUnhandledException: true,
        level: 'error',
        console: options.console,
        format: loggerFormat
      });

      globalTransports[options.name].push(errTransport);
    }

    if (globalWinstonInstance[options.name] === undefined) {
      globalWinstonInstance[options.name] = createLogger({
        transports: globalTransports[options.name],
        exitOnError: false
      });
    }
  }

  getInstance(name) {
    return globalWinstonInstance[name];
  }
}


module.exports = {
  Winston,
  globalWinstonInstance
};
