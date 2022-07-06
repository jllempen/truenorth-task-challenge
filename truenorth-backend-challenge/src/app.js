const middy = require('@middy/core');
const taskController = require('./controller');
const ApiGatewayEvent = require('./middleware/api-gateway-event');

const controllers = {
    ...taskController
};

let middlewares = [];
 
const apiGateway = ApiGatewayEvent();
middlewares.push(apiGateway);

function bootstrap(controller) {
    const handler = middy(async () => controller);

    middlewares.forEach((obj) => {
      handler.use(obj);
    });

    middlewares = [];
    return handler;
}
 
module.exports.handler = bootstrap(controllers);