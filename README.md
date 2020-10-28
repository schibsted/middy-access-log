# Schibsted Middy access log middleware

#### Access log middleware for the middy framework, the stylish Node.js middleware engine for AWS Lambda


This middleware logs processed requests in an access log like fashion.
I suggest using it together with [@schibsted/middy-error-handler](https://github.com/schibsted/middy-error-handler)

This access log is optimised for JSON loggers e.g. [bunyan](https://github.com/trentm/node-bunyan) or [pino](https://getpino.io/)

Sets headers in `after` and `onError` phases.


## Install

To install this middleware you can use NPM:

```bash
npm install --save @schibsted/middy-access-log
```


## Options

- `logger` (defaults to `console`) - a logging function that is invoked with the current error as an argument. You can pass `false` if you don't want the logging to happen.
- `level` (defaults to `info`) - log level to use for the log entries


See the sample usage below.


## Sample usage

```javascript
const middy = require('@middy/core');
const accessLog = require('@schibsted/middy-access-log');

const handler = middy(async () => ({
        statusCode: 200,
        body: JSON.stringify({ foo: 'bar' }),
    }));

handler
  .use(accessLog());
```


## Contributing

Everyone is very welcome to contribute to this repository. Feel free to [raise issues](https://github.com/schibsted/middy-access-log/issues) or to [submit Pull Requests](https://github.com/schibsted/middy-access-log/pulls).
