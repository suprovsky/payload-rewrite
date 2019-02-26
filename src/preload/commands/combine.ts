import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";
import got from "got";
import FormData from "form-data";
import { render } from "../../utils/render-log";

export const name = "combine";
export const description = "Combines 2 or more logs into a bigger log.";
export const usage = config.PREFIX + name + " <map> <title> <log url> <log url 2> [log url 3]...";
export const permissions = ["SEND_MESSAGES", "ATTACH_FILES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));

    let map = args[0];
    let title = args[1];
    let logs = args.slice(2);

    if (!map) return msg.channel.send("Missing <map> argument.");
    if (!title) return msg.channel.send("Missing <title> argument.");
    if (logs.length < 2) return msg.channel.send("Missing log url(s).");

    let ids: Array<string> = [];
    for(let i = 0; i < logs.length; i++) {
        let id = logs[i].match(/\d+/) as RegExpMatchArray;

        if (!id) return msg.channel.send(`\`${logs[i]}\` is not a valid log.`);

        ids.push(id[0]);
    }

    let form = new FormData();
        form.append("token", config.LOGSTF_API_KEY);
        form.append("title", title);
        form.append("map", map);
        form.append("ids", ids);

    got("https://sharkyy.io/api/logify/v3", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form,
        json: true
    }).then(async res => {
        if (!res.body.success) return msg.channel.send("Error combining logs.");

        msg.channel.send("**Done!** http://logs.tf/" + res.body.log_id);

        let screenshotBuffer = await render("http://logs.tf/" + res.body.log_id);

        msg.channel.send({
            files: [screenshotBuffer]
        });
    }).catch(err => {
        msg.channel.send("Error combining logs.");
    });
}