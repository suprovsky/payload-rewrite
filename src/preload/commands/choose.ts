import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";
import { random } from "../../utils/random";

export const name = "choose";
export const description = "Randomly chooses <amount> options from a list.";
export const usage = config.PREFIX + name + " <amount> [option 1] [option 2] [option3]...";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));

    if (!args[0]) return msg.channel.send("Missing <amount> argument.");
    if (args.slice(1).length < 2) return msg.channel.send("You must provide at least 2 options to choose from.");

    if (!Number(args[0])) return msg.channel.send("<amount> argument must be a number.");

    let amount = Number(args[0]);
    let options = args.slice(1);
    let chosen = [];
    for(let i = 0; i < amount; i++) {
        let chosenIndex = random(0, options.length - 1);

        chosen.push(options.splice(chosenIndex, 1));
    }

    msg.channel.send(chosen.join(", "));
}