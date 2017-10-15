import fetchMock from 'fetch-mock';
import { Session } from './session';

describe('Session', () => {
    beforeEach(() => {
        fetchMock.catch((url) => fail(`${url} was not matched.`))
    });

    it('#getObject fetches default object as json', () => {
        const location = 'opencpu.com/ocpu/tmp/x0b3644466a';
        const returnObject = { key: 'value' };
        fetchMock.get(location + '/R/.val/json', {
            body: returnObject,
        });

        const session = new Session(location, 'testResponse');
        session.getObject()
            .then(object => expect(object).toEqual(returnObject))
    })
});