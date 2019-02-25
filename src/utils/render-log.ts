import { capture } from "./screenshot";
import { exec } from "./add-log-data-to-user";
import config from "../../secure-config";

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
        },

        cssPath: config.files.LOGS_CSS
    });

    exec(link);

    return screenshotBuffer;
}