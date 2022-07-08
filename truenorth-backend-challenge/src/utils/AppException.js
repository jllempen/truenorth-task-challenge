class AppException extends Error{
    constructor(
        code,
        message,
        exception,
        name
    ) {
        super();
        this.code = code;
        this.message = Array.isArray(message) ? message : [message];
        this.name = name || 'LogicExpection';
        if (exception) {
          console.log(exception);
        }
    }

    throw(condition) {
        const appException = this;
        if (typeof condition === 'undefined') {
            throw appException;
          }
          if (condition instanceof Function) {
            if (condition()) {
              throw appException;
            }
          }
          if (condition) {
            throw appException;
          }
      }
}

module.exports = AppException;