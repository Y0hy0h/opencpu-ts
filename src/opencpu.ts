export class OpenCPU {
    private url: URL;

    setUrl(url: string) {
        const newUrl = new URL(url);
        const validOpenCpuPath = /\/ocpu\/library\/.+$/;
        const isValid = validOpenCpuPath.test(newUrl.pathname);
        if (!isValid) {
            throw new InvalidUrlError(`The URL ${newUrl} is not a valid OpenCPU path.\n` +
                `It should follow the form '/ocpu/library/packagename'.\n` +
                `Valid example: 'https://cloud.opencpu.org/ocpu/library/stocks'.`)
        }
        this.url = newUrl;
    }
}

export class InvalidUrlError extends TypeError {}
