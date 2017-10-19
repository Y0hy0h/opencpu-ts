export function itAsyncCases(expectation: string, assertion, argList: Array<Array<any>>) {
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
        });
    });
}
