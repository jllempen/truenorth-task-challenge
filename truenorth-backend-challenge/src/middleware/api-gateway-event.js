const AppException = require('../utils/AppException')

let isApiGatewayRestEvent;

async function getPayload(event) {
    if (isApiGatewayRestEvent) {
        const user = 'user';

        const trace = getTrace(event);

        return {
            ...event.body.payload,
            ...event.query,
            ...event.path,
            user,
            trace
        };
    }
}

function getTrace(event) {
    const trace = {};

    if (event.headers.traceId) {
        trace.id = event.headers.traceId;
    }

    if (event.headers.dateTime) {
        trace.dateTime = event.headers.dateTime;
    }

    if (event.headers['x-api-key']) {
        trace.apiKey = event.headers['x-api-key'];
    }

    return trace;
}

module.exports = (options) => {
    return {
        async before(handler) {
            const { event, context } = handler;
            isApiGatewayRestEvent = false;

            const { origin } = event;
            isApiGatewayRestEvent = (origin === 'API_GATEWAY_REST_EVENT');

            if (isApiGatewayRestEvent) {
                console.log('ApiGatewayEvent - Event');
                console.log(event);
                console.log('ApiGatewayEvent - Context');
                console.log(context);

                process.env.IS_OFFLINE = event.isOffline;

                const { passthrough } = options || {};
                if (!passthrough) {
                    const action = event.action;
                    const payload = await getPayload(event);
                    handler.event = { origin, action, payload };
                    console.log('ApiGatewayEvent - Origin');
                    console.log(handler.event.origin);
                    console.log('ApiGatewayEvent - Action');
                    console.log(handler.event.action);
                    console.log('ApiGatewayEvent - Payload');
                    console.log(handler.event.payload);
                }
            }
        },
        async after(handler) {
            if (isApiGatewayRestEvent) {
                const { action } = handler.event;
                let payload = {};
        
                const { passthrough } = options || {};
                if (passthrough) {
                  payload.headers = handler.event.headers;
                  payload.path = handler.event.path;
                  payload.body = handler.event.body ? handler.event.body.payload : undefined;
                  payload.query = handler.event.query;
                  payload.httpMethod = handler.event.httpMethod;
                } else {
                  payload = handler.event.payload;
                }
        
                const exception = new AppException(
                  'ERR-001',
                  'Handler could not be found',
                );

                exception.throw(!action);
                
                const functionToExecute = handler.response[action];
                
                exception.throw(!functionToExecute);

                const data = await functionToExecute(payload);
                handler.response = JSON.stringify({ payload: data });
                console.log('ApiGatewayEvent - Success Response');
                console.log(handler.response);
              }

        },
        async onError(handler) {
            if (isApiGatewayRestEvent) {
                console.log('ApiGatewayEvent - Error Response');
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

                console.log('error', error);
        
                return Promise.reject(JSON.stringify({ error }));
              }
        },
    }
}