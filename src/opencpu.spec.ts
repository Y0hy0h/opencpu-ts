import { OpenCPU } from './opencpu';

describe('ocpu', () => {
    let opencpu: OpenCPU;
    beforeEach(() => {
        opencpu = new OpenCPU();
    });

    itCases('#setUrl should accept valid URLs', (url) => {
        expect(() => opencpu.setUrl(url)).not.toThrow();
        expect(opencpu['url'].href).toEqual(url);
    }, [
        ['localhost:5656/ocpu/library/statlets'],
        ['https://cloud.opencpu.org/ocpu/library/stocks'],
    ]);

    itCases('#setUrl should throw an error for invalid URLs', (url) => {
            expect(() => opencpu.setUrl(url)).toThrowError(TypeError);
        },
        [
            [''],
            ['localhost:5656/ocpu/library'],
        ]
    );

});

function itCases(expectation: string, assertion, argList: Array<Array<any>>) {
    describe(expectation, () => {
        argList.forEach((args: Array<any>) => {
            it(args.join(' | '), () => {
                assertion.apply(this, args);
            })
        });
    });
}
