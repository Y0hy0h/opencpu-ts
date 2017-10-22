import { Session } from './session';

export class OpenCPU {
    private url: URL;

    async setUrl(url: string): Promise<URL> {
        const newUrl = new URL(url);
        const validOpenCpuPath = /\/ocpu\/library\/.+$/;
        const isValid = validOpenCpuPath.test(newUrl.pathname);
        if (!isValid) {
            throw new InvalidUrlError(newUrl.href);
        }
        let response: Response = await fetch(newUrl.href);
        if (response.ok) {
            this.url = newUrl;
            return this.url;
        } else {
            throw new UrlUnreachableError(newUrl.href, response.status);
        }

    }

    async call(functionName: string, args: object): Promise<Session> {
        const argsForm = OpenCPU.constructForm(args);
        const response = await fetch(this.url + '/R/' + functionName, {
            method: 'POST',
            body: argsForm,
        });
        if (response.status == 400) {
            const errorMessage = await response.text();
            throw new RError(errorMessage);
        }

        const location = response.headers.get(SESSION_LOCATION);
        const responseText = await response.text();
        return new Session(location, responseText);
    }

    private static constructForm(args: object): FormData {
        const argsForm = new FormData();
        for (const key in args) {
            let value = args[key];
            if (value instanceof File) { } // Files should be kept as Files
            else if (value instanceof CodeSnippet) value = value.code;
            else value = JSON.stringify(args[key]);

            argsForm.append(key, value);
        }
        return argsForm;
    }
}

export class CodeSnippet {
    constructor(
        public code: string,
    ) {}
}

export const SESSION_LOCATION = 'Location';

export class InvalidUrlError extends TypeError {
    constructor(invalidUrl: string) {
        const message = `The URL ${invalidUrl} is not a valid OpenCPU path.\n` +
            `It should follow the form '/ocpu/library/packagename'.\n` +
            `Valid example: 'https://cloud.opencpu.org/ocpu/library/stocks'.`;
        super(message);
    }
}

export class UrlUnreachableError extends URIError {
    constructor(url: string, statusCode: number) {
        const message = `Could not contact ${url}. Response code was ${statusCode}.`;
        super(message);
    }
}

export class RError extends EvalError {}