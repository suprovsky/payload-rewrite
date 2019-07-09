/**
 * Taken from https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/examples/making-an-eval-command.md.
 */

import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import util from "util";
import { User } from "../../models/User";
import { Server } from "../../models/Server";
import { Bot as BotDoc } from "../../models/Bot";

export const name = "eval";
export const description = "Remote JS execution for root users.";
export const usage = config.PREFIX + name + " <js>";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];
export const requiresRoot = true;

export async function run(bot: Bot, msg: Message) {
    const code = msg.content.slice(config.PREFIX.length + name.length).trim();

    try {
        let evaled = eval(code);

        if (typeof evaled !== "string")
            evaled = util.inspect(evaled);

        msg.channel.send(clean(evaled), {
            code: "xl"
        });
    } catch (err) {
        msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}

function clean(text: any) {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}