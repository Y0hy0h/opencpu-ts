import fetchMock from 'fetch-mock';
import { Session } from './session';
import { itAsyncCases } from './jasmineCases';

describe('Session', () => {
    const location = 'opencpu.com/ocpu/tmp/x0b3644466a';
    beforeEach(() => {
        fetchMock.catch((url) => fail(`${url} was not matched.`))
    });

    afterEach(() => {
        fetchMock.restore();
    });

    it('#getObject fetches default object as json', () => {
        const returnObject = { key: 'value' };
        fetchMock.get(location + '/R/.val/json', {
            body: returnObject,
        });

        const session = new Session(location, 'testResponse');
        session.getObject()
            .then(object => expect(object).toEqual(returnObject))
    });

    itAsyncCases('#get maps to correct request', (resource: string, done) => {
        const expectedResponse = new Response('returnMe');
        fetchMock.get(location + '/' + resource, expectedResponse);

        const session = new Session(location, 'testResponse');
        session.get(resource)
            .then(response => expect(response).toEqual(expectedResponse))
            .then(done, done);
    }, [
        ['graphics'],
        ['stdout'],
        ['R'],
    ]);
});
