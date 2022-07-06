const AppException = require('../utils/AppException')

let isLambdaEvent;

module.exports = () => {
  return {
    async before(handler) {
      const { event, context } = handler;
      isLambdaEvent = false;

      const { origin } = event;
      isLambdaEvent = (origin === 'LAMBDA_EVENT');

      if (isLambdaEvent) {
        console.log('LambdaEvent - Event');
        console.log(event);
        console.log('LambdaEvent - Context');
        console.log(context);

        const action = event.action;
        const payload = event.payload;
        handler.event = { action, payload };

        console.log('LambdaEvent - Origin');
        console.log(origin);
        console.log('LambdaEvent - Action');
        console.log(action);
        console.log('LambdaEvent - Payload');
        console.log(payload);
      }
    },
    async after(handler) {
      if (isLambdaEvent) {
        const { action, payload } = handler.event;
        
        const exception = new AppException(
          'ERR-001',
          'Handler could not be found',
        );

        exception.throw(!action);
        
        const functionToExecute = handler.response[action];
        
        exception.throw(!functionToExecute);
        
        const data = await functionToExecute(payload);
        handler.response = JSON.stringify({ payload: data });
        console.log('LambdaEvent - Success Response');
        console.log(handler.response);
      }

    },
    async onError(handler) {
      if (isLambdaEvent) {
        console.log('LambdaEvent - Error Response');
        console.log(handler.error);
        const error = {
          ...handler.error,
        };
                
        if (error.name === 'BusinessException') {
          error.httpStatus = 422;
        } else if (error.name === 'ValidationException') {
          error.httpStatus = 400;
        } else if (!error.httpStatus) {
          error.httpStatus = 500;
        }

        delete error.name;

        return Promise.reject(JSON.stringify({ error }));
      }
    },
  }
}