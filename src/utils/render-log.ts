import { capture } from "./screenshot";

export async function render(link: string): Promise<Buffer> {
    let screenshotBuffer = await capture(link, {
        top: {
            selector: "#log-header",
            edge: "top"
        },
        left: {
            selector: "#log-header",
            edge: "left"
        },
        right: {
            selector: "#log-header",
            edge: "right"
        },
        bottom: {
            selector: "#log-section-players",
            edge: "bottom"
        }
    });

    return screenshotBuffer;
}