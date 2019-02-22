import { capture } from "./screenshot";
import child_process from "child_process";
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

    console.log("Starting log stats appender child process.");
    let child = child_process.fork(__dirname + "/add-log-data-to-user.ts", [], {
        env: {
            "LOGS": link
        }
    });
    child.on("message", msg => {
        console.log(msg);
    });
    child.on("exit", code => {
        console.log("Log stats appender child process exited with code " + code);
    });

    return screenshotBuffer;
}