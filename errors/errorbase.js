class ErrorBase extends Error {

  getMessage() {
    return this.message;
  }

}

module.exports = ErrorBase;
