'use strict';


function getUri(method, url) {
  let uri;

  const index = url.lastIndexOf('?');
  if (index >= 0) {
    uri = url.slice(0, url.lastIndexOf('?'));
  } else {
    uri = url;
  }

  return uri;
}


module.exports = {
  getUri
};
