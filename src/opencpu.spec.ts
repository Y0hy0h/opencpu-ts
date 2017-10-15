import fetchMock from 'fetch-mock';
import { OpenCPU, SESSION_LOCATION } from './opencpu';
import { Session } from './session';
import { itAsyncCases } from './jasmineCases';

describe('OpenCPU', () => {
    let opencpu: OpenCPU;
    beforeEach(() => {
        opencpu = new OpenCPU();
        fetchMock.catch((url) => fail(`${url} was not matched.`))
    });

    afterEach(() => {
        fetchMock.restore();
    });

    describe('#setUrl', () => {
        itAsyncCases('#setUrl should accept valid URLs', (urlString, done) => {
                fetchMock.mock(urlString, 200);

                opencpu.setUrl(urlString)
                    .then(url => expect(url.href).toEqual(urlString))
                    .catch(fail)
                    .then(done);
            }, [
                ['localhost:5656/ocpu/library/statlets'],
                ['https://cloud.opencpu.org/ocpu/library/stocks'],
            ],
        );

        itAsyncCases('#setUrl should throw an error for invalid URLs', (urlString, done) => {
                fetchMock.mock('*', 200);

                opencpu.setUrl(urlString)
                    .then(fail)
                    .catch(error => expect(error).toEqual(jasmine.any(TypeError)))
                    .then(done);
            },
            [
                [''],
                ['localhost:5656/ocpu/library'],
            ],
        );

        it('#setUrl should succeed if url resonds with 200', (done) => {
            const urlString = 'https://existantdomain.com/ocpu/library/packagename';
            fetchMock.mock(urlString, 200);

            opencpu.setUrl(urlString)
                .then(url => expect(url.href).toEqual(urlString))
                .catch(fail)
                .then(done);
        });

        it('#setUrl should fail promise if url cannot be contacted', (done) => {
            const urlString = 'https://nope.com/ocpu/library/packagename';
            fetchMock.mock(urlString, () => {throw new TypeError("Failed to fetch");});

            opencpu.setUrl(urlString)
                .then(fail)
                .catch(error => expect(error).toEqual(new TypeError("Failed to fetch")))
                .then(done);
        });
    });

    describe('with url set', () => {
        const baseUrl = 'https://opencpu.com/ocpu';
        const packageUrl = baseUrl + '/library/package';
        beforeEach((done) => {
            fetchMock.mock(packageUrl, 200);

            opencpu.setUrl(packageUrl)
                .catch(error => fail(error))
                .then(done);
        });

        it('#call should make a post request to the correct function', (done) => {
            const functionName = 'function';
            const args = {first: 'hello'};

            const matchedUrl = packageUrl + '/R/' + 'function';
            fetchMock.mock(matchedUrl, 200);

            const argsForm = new FormData();
            Object.keys(args).forEach(key => argsForm.append(key, args[key]));

            opencpu.call(functionName, args)
                .then(() => {
                    const callArgs = fetchMock.lastCall(matchedUrl);
                    expect(callArgs[1]).toEqual(jasmine.objectContaining({body: argsForm,},));
                })
                .then(done);
        });

        it('#call should return `Session` object', (done) => {
            const functionName = 'function';
            const args = {first: 'hello'};

            const responseText = 'all went well';
            const sessionLocation = baseUrl + '/tmp/x0b3644466a';
            const expectedSession = new Session(sessionLocation, responseText);

            const headers = new Headers();
            headers.append(SESSION_LOCATION, sessionLocation);
            const matchedUrl = packageUrl + '/R/' + 'function';
            fetchMock.mock(matchedUrl, {
                body: responseText,
                headers: headers,
            });

            const argsForm = new FormData();
            Object.keys(args).forEach(key => argsForm.append(key, args[key]));

            opencpu.call(functionName, args)
                .then((session) => {
                    expect(session).toEqual(expectedSession);
                })
                .then(done);
        });
    });
});
