import { InvalidUrlError, OpenCPU } from './opencpu';

describe('ocpu', () => {
    it('should export class', () => {
        new OpenCPU();
    });

    cases('#setUrl should sanitize url', (url, expectedError) => {
        const opencpu = new OpenCPU();

        if (expectedError === null) {
            expect(() => opencpu.setUrl(url)).not.toThrow();
            expect(opencpu['url'].toString()).toEqual(url);
        } else {
            expect(() => opencpu.setUrl(url)).toThrowError(TypeError);
        }
    }, [
        ['localhost:5656/ocpu/library/statlets', null],
        ['https://cloud.opencpu.org/ocpu/library/stocks', null],
        ['', TypeError],
        ['localhost:5656/ocpu/library', InvalidUrlError],
    ]);

});

function cases(expectation: string, assertion, argList: Array<Array<any>>) {
    describe(expectation, () => {
        argList.forEach((args: Array<any>) => {
            it(args.join(' | '), () => {
                assertion.apply(this, args);
            })
        });
    });
}
