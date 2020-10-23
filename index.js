const { performance } = require('perf_hooks');
const omit = require('lodash.omit');

const logResponse = ({ logger, level, event, response, duration }) => {
    logger[level](
        {
            req: {
                method: event.requestContext.httpMethod,
                url: event.path,
                headers: omit(event.headers, ['cookie']),
            },
            res: omit(response, ['body']),
            duration,
        },
        `  --> ${event.requestContext.httpMethod} ${event.path} ${response.statusCode} ${duration}ns`
    );
};

const accessLogMiddleware = ({ logger = console, level = 'info' }) => ({
    before: async ({ event }) => {
        // eslint-disable-next-line no-param-reassign
        event.requestContext.requestStart = performance.now();
    },
    after: async (handler) => {
        logResponse({
            logger,
            level,
            event: { ...handler.event },
            response: handler.response,
            duration: Math.round(performance.now() - handler.event.requestContext.requestStart) * 1000000,
        });
    },
    onError: async (handler) => {
        logResponse({
            logger,
            level,
            event: { ...handler.event },
            response: handler.response,
            duration: Math.round(performance.now() - handler.event.requestContext.requestStart) * 1000000,
        });

        return handler.error;
    },
});

module.exports = accessLogMiddleware;
