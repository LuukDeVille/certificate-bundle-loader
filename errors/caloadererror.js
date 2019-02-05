var ErrorBase = require('./errorbase');

class CaLoaderError extends ErrorBase {

  constructor(message) {
    super();
    this.message = message;
  }

}

module.exports = CaLoaderError;
