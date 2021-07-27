const { performance } = require('perf_hooks');
const R = require('ramda');

const logResponse = ({ logger, level, excludeHeaders, event, response, duration }) => {
    logger[level](
        {
            req: {
                method: event.httpMethod,
                url: event.path,
                headers: R.omit(excludeHeaders, event.headers),
            },
            res: R.omit(['body'], response),
            duration,
        },
        `  --> ${event.httpMethod} ${event.path} ${R.propOr('', 'statusCode', response)} ${duration}ns`
    );
};

const accessLogMiddleware = ({ logger = console, level = 'info', excludeHeaders = [] } = {}) => ({
    before: async ({ event }) => {
        // eslint-disable-next-line no-param-reassign
        event.requestStart = performance.now();
    },
    after: async (handler) => {
        logResponse({
            logger,
            level,
            excludeHeaders,
            event: { ...handler.event },
            response: handler.response,
            duration: Math.round(performance.now() - handler.event.requestStart) * 1000000,
        });
    },
    onError: async (handler) => {
        logResponse({
            logger,
            level,
            excludeHeaders,
            event: { ...handler.event },
            response: handler.response,
            duration: Math.round(performance.now() - handler.event.requestStart) * 1000000,
        });
    },
});

module.exports = accessLogMiddleware;
