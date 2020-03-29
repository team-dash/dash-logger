'use strict';


const Promise = require('bluebird');
const mkdirp = Promise.promisify(require('mkdirp'));
const fs = Promise.promisifyAll(require('fs'));


async function checkAndMkdirSync(dirName, mode) {
  const existed = await fs.existsSync(dirName);
  if (existed) {
    return Promise.resolve(true);
  }

  const opts = {};
  opts.mode = mode;

  return new Promise((resolve, reject) => {
    mkdirp(dirName, opts)
      .then(() => {
        resolve(true);
      }, err => {
        console.log(`mkdirp ${dirName} err:`, JSON.stringify(err));
        reject(err);
      });
  });
}


module.exports = {
  checkAndMkdirSync
};
