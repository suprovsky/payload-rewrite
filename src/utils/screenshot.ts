import puppeteer, { ScreenshotOptions, JSONObject } from "puppeteer";

interface CaptureOptions extends ScreenshotOptions {
    waitFor?: string,
    top?: string,
    bottom?: string,
    left?: string,
    right?: string
};

/**
 * Takes a screenshot of an element. Will wait 30 seconds for the element to load before timing out.
 * @param url The URL to take the screenshot in.
 * @param selector The element selector.
 */
export async function captureSelector(url: string, selector: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    const page = await browser.newPage();
    await page.goto(url);

    let pageElement = await page.waitForSelector(selector);

    if (!pageElement) {
        throw new Error("Counld not find element using selector " + selector);
    }

    let screenshotBuffer = await pageElement.screenshot({
        encoding: "binary"
    });

    return screenshotBuffer;
}

export async function capture(url: string, options: CaptureOptions = {}): Promise<Buffer> {
    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    const page = await browser.newPage();
    await page.goto(url);

    let data = await page.evaluate((options: CaptureOptions) => {}, options as JSONObject);
    
    //TODO: Finish coordinate-based screenshot function.

    return new Buffer("");
}