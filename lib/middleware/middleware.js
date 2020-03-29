'use strict';


const { Url } = require('../util');
const { DefaultOption } = require('../logger');


const TRACEID_HEADER = 'x-trace-id'; // http headers

function middleware(Logger, options = {}) {

  async function buildKoa2LoggerHandler(ctx, next) {

    let loggerName;
    if (options.name === undefined) {
      loggerName = 'logger';
    } else {
      loggerName = options.name;
    }

    const uri = Url.getUri(ctx.method, ctx.url);

    const httpOptions = {
      api: uri,
      method: ctx.method
    };

    if (ctx.req.headers[ TRACEID_HEADER ]) {
      httpOptions.traceId = ctx.req.headers[ TRACEID_HEADER ];
    }

    const curOptions = Object.assign(httpOptions, DefaultOption, options);

    const baseNodeLoggerInstance = new Logger(curOptions);

    // set to koa ctx
    ctx[loggerName] = baseNodeLoggerInstance;

    await next();
  }

  return buildKoa2LoggerHandler;
}


module.exports = middleware;
