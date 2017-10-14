import fetchMock from 'fetch-mock';
import { OpenCPU } from './opencpu';

describe('ocpu', () => {
    let opencpu: OpenCPU;
    beforeEach(() => {
        opencpu = new OpenCPU();
    });

    afterEach(() => {
        fetchMock.restore();
    });

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

function itCases(expectation: string, assertion, argList: Array<Array<any>>) {
    const itCall = (args) => {
        it.bind(args.join(' | '), () => {
            assertion.apply(this, args);
        });
    };
    unwrapArgList(expectation, argList, itCall);
}

function itAsyncCases(expectation: string, assertion, argList: Array<Array<any>>) {
    const itCall = (args) => {
        it(args.join(' | '), (done) => {
            args.push(done);
            assertion.apply(this, args);
        });
    };
    unwrapArgList(expectation, argList, itCall);
}

function unwrapArgList(expectation: string, argList: Array<Array<any>>, itCall: ((args: Array<any>) => any)) {
    describe(expectation, () => {
        argList.forEach((args: Array<any>) => {
            itCall(args);
        })
    })
}