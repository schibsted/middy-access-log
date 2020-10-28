const { performance } = require('perf_hooks');
const R = require('ramda');

const logResponse = ({ logger, level, event, response, duration }) => {
    logger[level](
        {
            req: {
                method: event.httpMethod,
                url: event.path,
                headers: R.omit(['cookie'], event.headers),
            },
            res: R.omit(['body'], response),
            duration,
        },
        `  --> ${event.httpMethod} ${event.path} ${R.propOr('', 'statusCode', response)} ${duration}ns`
    );
};

const accessLogMiddleware = ({ logger = console, level = 'info' } = {}) => ({
    before: async ({ event }) => {
        // eslint-disable-next-line no-param-reassign
        event.requestStart = performance.now();
    },
    after: async (handler) => {
        logResponse({
            logger,
            level,
            event: { ...handler.event },
            response: handler.response,
            duration: Math.round(performance.now() - handler.event.requestStart) * 1000000,
        });
    },
    onError: async (handler) => {
        logResponse({
            logger,
            level,
            event: { ...handler.event },
            response: handler.response,
            duration: Math.round(performance.now() - handler.event.requestStart) * 1000000,
        });

        return handler;
    },
});

module.exports = accessLogMiddleware;
