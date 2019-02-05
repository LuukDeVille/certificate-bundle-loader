var ErrorBase = require('./errorbase');

class CsvTransformError extends ErrorBase {

  constructor(message) {
    super();
    this.message = message;
  }

}

module.exports = CsvTransformError;
