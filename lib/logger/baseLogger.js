'use strict';


const { format } = require('util');
const { Path, TraceId, PLACE_HOLDER } = require('../util');
const DefaultOption = require('./defaultOption');
const { Winston, globalWinstonInstance } = require('../service/winston');
const traceIdInstance = new TraceId();
const process = require('process');


class BaseLogger {

  constructor(options = DefaultOption) {

    this.context = {};
    const ctx = this.context;

    ctx.startTimestamp = Date.now();

    let traceId;
    if (options.traceId) {
      traceId = options.traceId;
    } else {
      if (options.autoTraceId === true) {
        traceId = traceIdInstance.generate();
      } else {
        traceId = PLACE_HOLDER;
      }
    }

    // config
    if (options.datePattern !== undefined) {
      ctx.datePattern = options.datePattern;
    } else {
      ctx.datePattern = '-YYYY.MM.DD';
    }

    if (options.hasOwnProperty('isDatePrefix') && options.isDatePrefix === true) { // 前置日期
      ctx.isDatePrefix = options.isDatePrefix;
    } else {
      ctx.isDatePrefix = false;
    }

    if (options.hasOwnProperty('name')) {
      ctx.name = options.name;
    } else {
      ctx.name = DefaultOption.name;
    }

    ctx.dir = options.dir ? options.dir : DefaultOption.dir;
    ctx.filename = options.filename ? options.filename : DefaultOption.filename;
    ctx.console = options.console ? options.console : DefaultOption.console;
    ctx.level = options.level ? options.level : DefaultOption.level;
    ctx.needErrorFile = options.needErrorFile ? options.needErrorFile : DefaultOption.needErrorFile;
    ctx.closeFile = options.closeFile ? options.closeFile : DefaultOption.closeFile;

    // log message items
    ctx.module = options.module || PLACE_HOLDER; // 使用模块名
    ctx.func = options.func || PLACE_HOLDER;
    ctx.pid = process.pid;
    ctx.traceId = traceId;
    ctx.api = options.api || PLACE_HOLDER;
    ctx.method = options.method || PLACE_HOLDER;
    ctx.timeCost = PLACE_HOLDER;

    // 创建ctx.dir, 需要权限
    Path.checkAndMkdirSync(ctx.dir);

    if (globalWinstonInstance[ctx.name] === undefined) {
      const winston = new Winston(ctx);
      globalWinstonInstance[ctx.name] = winston.getInstance(ctx.name);
    }
  }

  setModule(module) {
    this.context.module = module;
    return this;
  }

  buildPrefix() {
    this.prefixStr =
      `${this.context.traceId}` + ' ' +
      `${this.context.pid}` + ' ' +
      `${this.context.api}` + ' ' +
      `${this.context.module}` + ' ' +
      `${this.context.func}` + ' ' +
      `${this.context.timeCost}`;
  }

  getModule() {
    return this.context.module;
  }

  setFunc(func) {
    this.context.func = func;
    return this;
  }

  getFunc() {
    return this.context.func;
  }

  getTraceId() {
    return this.context.traceId;
  }

  setTraceId(traceId) {
    this.context.traceId = traceId;
    return this;
  }

  info(...args) {
    const curTimestamp = Date.now();
    const timeCost = curTimestamp - this.context.startTimestamp;
    this.context.timeCost = String(timeCost) + 'ms';

    const content = format(...args);
    this.buildPrefix();
    const curLog = `${this.prefixStr} | ${content}`;

    globalWinstonInstance[this.context.name].info(curLog);
  }

  debug(...args) {
    const curTimestamp = Date.now();
    const timeCost = curTimestamp - this.context.startTimestamp;
    this.context.timeCost = String(timeCost) + 'ms';

    const content = format(...args);
    this.buildPrefix();
    const curLog = `${this.prefixStr} | ${content}`;

    globalWinstonInstance[this.context.name].debug(curLog);
  }

  error(...args) {
    const curTimestamp = Date.now();
    const timeCost = curTimestamp - this.context.startTimestamp;
    this.context.timeCost = String(timeCost) + 'ms';

    const content = format(...args);
    this.buildPrefix();
    const curLog = `${this.prefixStr} | ${content}`;

    globalWinstonInstance[this.context.name].error(curLog);
  }

  warn(...args) {
    const curTimestamp = Date.now();
    const timeCost = curTimestamp - this.context.startTimestamp;
    this.context.timeCost = String(timeCost) + 'ms';

    const content = format(...args);
    this.buildPrefix();
    const curLog = `${this.prefixStr} | ${content}`;

    globalWinstonInstance[this.context.name].warn(curLog);
  }

  trace(...args) {
    const curTimestamp = Date.now();
    const timeCost = curTimestamp - this.context.startTimestamp;
    this.context.timeCost = String(timeCost) + 'ms';

    const content = format(...args);
    this.buildPrefix();
    const curLog = `${this.prefixStr} | ${content}`;

    globalWinstonInstance[this.context.name].trace(curLog);
  }

  fatal(...args) {
    const curTimestamp = Date.now();
    const timeCost = curTimestamp - this.context.startTimestamp;
    this.context.timeCost = String(timeCost) + 'ms';

    const content = format(...args);
    this.buildPrefix();
    const curLog = `${this.prefixStr} | ${content}`;

    globalWinstonInstance[this.context.name].fatal(curLog);
  }
}


module.exports = BaseLogger;
