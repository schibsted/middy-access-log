const middy = require('@middy/core');
const createError = require('http-errors');
const middleware = require('./index');

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
            cookie:
                'Phpstorm-79d24baa=172d13ea-950c-4011-b17d-56aaa9bd9e7c; Phpstorm-79d24bab=739b7880-e8b6-48a3-86e9-5f8ff0258361; _lp4_u=s0CHloIZ5X; _lp4_c=; Phpstorm-79d24bac=04b072cb-9640-47c8-8bb7-69d89af629ed; Phpstorm-79d24f6c=941943f9-6402-4be0-8c4b-42ab91078d26; Phpstorm-79d24f6d=c27d49d1-ef78-47c8-a0d4-34057bbe6a6d; amplitude_id_8ac078110370fb0bbfbaf21c2f885725=eyJkZXZpY2VJZCI6Ijk0YjU4OTQ0LTliZDUtNGQ3ZC1iZDg1LWQ5NzBjMDdkZmEzZVIiLCJ1c2VySWQiOm51bGwsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTU3NTk4Mzc5OTkzNywibGFzdEV2ZW50VGltZSI6MTU3NTk4NTAwMTAwOSwiZXZlbnRJZCI6MTYsImlkZW50aWZ5SWQiOjAsInNlcXVlbmNlTnVtYmVyIjoxNn0=; Phpstorm-79d2532e=7ad47b13-068c-4b85-9a59-08bd667d4d3e; _hjid=920a43ae-c27e-4cd7-8bce-cfb25d673c8c; _ga=GA1.1.487932309.1584426684; _hjMinimizedPolls=498936; Phpstorm-78282354=0cb6d112-59c3-4771-8b0d-c49c2c35cd4f; _pulse2data=f22ccca8-e6fb-4fe8-a9e6-71037d264c6b%2Cv%2C%2C1602510266259%2CeyJpc3N1ZWRBdCI6IjIwMTctMDctMDVUMDY6NDZaIiwiZW5jIjoiQTEyOENCQy1IUzI1NiIsImFsZyI6ImRpciIsImtpZCI6IjIifQ..WMRVvkUtl5GSDDPG52oSoQ.x4RmfEYeHJDh6ut8oCm1dzfsFzA-R_MTSr9b0khJMOZWv43XUW0LGCCtD6SZipMBjDMY-ONX6ywW_ma2gSi7IC9dHjWSGa9D--3b92N_q_Dr9k8x8mrf_0Plh67PwosAsOGaROy2SEO0SPb0sInac36D4bJWWNVk1YkuzkKO8YW86AuPj5Fr4CoyB9UVUp79y2c1m6MffA7FAEQ6nGLL7fKdeQXbStZMejnSN_ptZtA.kWBMiCFRp2hNRERaFD4rKA%2C4443096159538299%2C1602523766259%2Ctrue%2C%2CeyJraWQiOiIyIiwiYWxnIjoiSFMyNTYifQ..j8qlnJn7-TFbyS8IF-EYFx5clLViCrfMwmQCL1OoZOw; Phpstorm-78282355=dba20690-40f7-472b-ae3a-c2b4f0f51611',
        },
        path: '/foobar',
        httpMethod: 'GET',
    };

    await handler(event, {});
    expect(mockLogger.info).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toMatchSnapshot();
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
            cookie:
                'Phpstorm-79d24baa=172d13ea-950c-4011-b17d-56aaa9bd9e7c; Phpstorm-79d24bab=739b7880-e8b6-48a3-86e9-5f8ff0258361; _lp4_u=s0CHloIZ5X; _lp4_c=; Phpstorm-79d24bac=04b072cb-9640-47c8-8bb7-69d89af629ed; Phpstorm-79d24f6c=941943f9-6402-4be0-8c4b-42ab91078d26; Phpstorm-79d24f6d=c27d49d1-ef78-47c8-a0d4-34057bbe6a6d; amplitude_id_8ac078110370fb0bbfbaf21c2f885725=eyJkZXZpY2VJZCI6Ijk0YjU4OTQ0LTliZDUtNGQ3ZC1iZDg1LWQ5NzBjMDdkZmEzZVIiLCJ1c2VySWQiOm51bGwsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTU3NTk4Mzc5OTkzNywibGFzdEV2ZW50VGltZSI6MTU3NTk4NTAwMTAwOSwiZXZlbnRJZCI6MTYsImlkZW50aWZ5SWQiOjAsInNlcXVlbmNlTnVtYmVyIjoxNn0=; Phpstorm-79d2532e=7ad47b13-068c-4b85-9a59-08bd667d4d3e; _hjid=920a43ae-c27e-4cd7-8bce-cfb25d673c8c; _ga=GA1.1.487932309.1584426684; _hjMinimizedPolls=498936; Phpstorm-78282354=0cb6d112-59c3-4771-8b0d-c49c2c35cd4f; _pulse2data=f22ccca8-e6fb-4fe8-a9e6-71037d264c6b%2Cv%2C%2C1602510266259%2CeyJpc3N1ZWRBdCI6IjIwMTctMDctMDVUMDY6NDZaIiwiZW5jIjoiQTEyOENCQy1IUzI1NiIsImFsZyI6ImRpciIsImtpZCI6IjIifQ..WMRVvkUtl5GSDDPG52oSoQ.x4RmfEYeHJDh6ut8oCm1dzfsFzA-R_MTSr9b0khJMOZWv43XUW0LGCCtD6SZipMBjDMY-ONX6ywW_ma2gSi7IC9dHjWSGa9D--3b92N_q_Dr9k8x8mrf_0Plh67PwosAsOGaROy2SEO0SPb0sInac36D4bJWWNVk1YkuzkKO8YW86AuPj5Fr4CoyB9UVUp79y2c1m6MffA7FAEQ6nGLL7fKdeQXbStZMejnSN_ptZtA.kWBMiCFRp2hNRERaFD4rKA%2C4443096159538299%2C1602523766259%2Ctrue%2C%2CeyJraWQiOiIyIiwiYWxnIjoiSFMyNTYifQ..j8qlnJn7-TFbyS8IF-EYFx5clLViCrfMwmQCL1OoZOw; Phpstorm-78282355=dba20690-40f7-472b-ae3a-c2b4f0f51611',
        },
        path: '/foobar',
        httpMethod: 'GET',
    };

    await expect(handler(event, {})).rejects.toEqual(
        expect.objectContaining({
            error,
        })
    );

    expect(mockLogger.info).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toMatchSnapshot();
});
