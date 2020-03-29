'use strict';


const PWD = process.cwd();
const DEFAULT_LOGGER_NAME = 'logger';


const defaultOptions = {
  name: DEFAULT_LOGGER_NAME,
  level: 'debug',
  dir: PWD + '/logs',
  filename: 'app',
  console: false,
  needErrorFile: false,
  autoTraceId: true,
  closeFile: false
};


module.exports = defaultOptions;
