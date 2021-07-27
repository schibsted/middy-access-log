const middy = require('@middy/core');
const createError = require('http-errors');
const middleware = require('./index');

jest.mock('perf_hooks', () => {
    const performanceMock = {
        now: jest.fn().mockReturnValue(1),
    };
    return { performance: performanceMock };
});

test('Middleware logs on success', async () => {
    const handler = middy(async () => ({
        statusCode: 200,
        body: JSON.stringify({ foo: 'bar' }),
        headers: {
            someHeader: 'someValue',
        },
    }));

    const mockLogger = {
        info: jest.fn(() => {}),
    };

    handler.use(middleware({ logger: mockLogger }));

    const event = {
        headers: {
            host: 'localhost:3000',
            connection: 'keep-alive',
            'upgrade-insecure-requests': '1',
            'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
            accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,pl;q=0.7,nb;q=0.6,no;q=0.5',
            cookie: 'my cookie 1; my cookie 2',
        },
        path: '/foobar',
        httpMethod: 'GET',
    };

    await handler(event, {});
    expect(mockLogger.info).toHaveBeenCalledTimes(1);
    expect(mockLogger.info.mock.calls[0]).toMatchSnapshot();
});

test('Middleware logs on error', async () => {
    const error = new createError.InternalServerError('whoops');
    const handler = middy(async () => {
        throw error;
    });

    const mockLogger = {
        info: jest.fn(() => {}),
    };

    handler.use(middleware({ logger: mockLogger }));

    const event = {
        headers: {
            host: 'localhost:3000',
            connection: 'keep-alive',
            'upgrade-insecure-requests': '1',
            'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
            accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,pl;q=0.7,nb;q=0.6,no;q=0.5',
            cookie: 'my cookie 1; my cookie 2',
        },
        path: '/foobar',
        httpMethod: 'GET',
    };

    await expect(handler(event, {})).rejects.toEqual(error);

    expect(mockLogger.info).toHaveBeenCalledTimes(1);
    expect(mockLogger.info.mock.calls[0]).toMatchSnapshot();
});

test('Middleware skips sensitive headers on success', async () => {
    const handler = middy(async () => ({
        statusCode: 200,
        body: JSON.stringify({ foo: 'bar' }),
        headers: {
            someHeader: 'someValue',
        },
    }));

    const mockLogger = {
        info: jest.fn(() => {}),
    };

    handler.use(
        middleware({ logger: mockLogger, excludeHeaders: ['cookie', 'authentication', 'customRequestSignature'] })
    );

    const event = {
        headers: {
            host: 'localhost:3000',
            connection: 'keep-alive',
            'upgrade-insecure-requests': '1',
            'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
            accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,pl;q=0.7,nb;q=0.6,no;q=0.5',
            cookie: 'my cookie 1; my cookie 2',
            authentication: 'super secret token',
            customRequestSignature: 'foobar 123',
        },
        path: '/foobar',
        httpMethod: 'GET',
    };

    await handler(event, {});
    expect(mockLogger.info).toHaveBeenCalledTimes(1);
    expect(mockLogger.info.mock.calls[0]).toMatchSnapshot();
});

test('Middleware skips sensitive headers on error', async () => {
    const error = new createError.InternalServerError('whoops');
    const handler = middy(async () => {
        throw error;
    });

    const mockLogger = {
        info: jest.fn(() => {}),
    };

    handler.use(
        middleware({ logger: mockLogger, excludeHeaders: ['cookie', 'authentication', 'customRequestSignature'] })
    );
    const event = {
        headers: {
            host: 'localhost:3000',
            connection: 'keep-alive',
            'upgrade-insecure-requests': '1',
            'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
            accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,pl;q=0.7,nb;q=0.6,no;q=0.5',
            cookie: 'my cookie 1; my cookie 2',
            authentication: 'super secret token',
            customRequestSignature: 'foobar 123',
        },
        path: '/foobar',
        httpMethod: 'GET',
    };

    await expect(handler(event, {})).rejects.toEqual(error);

    expect(mockLogger.info).toHaveBeenCalledTimes(1);
    expect(mockLogger.info.mock.calls[0]).toMatchSnapshot();
});
