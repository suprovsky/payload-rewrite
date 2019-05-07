import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";
import { User, UserModel } from "../../models/User";

export const name = "config";
export const description = "MAKE SURE TO USE THESE COMMANDS ONLY IN BOT DMS!\nlogs-api-key: Sets your logs.tf API key to <key>. Your API key can be retrieved from http://logs.tf/uploader.";
export const usage = `${config.PREFIX}${name} logs-api-key <key>`;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["dm"];

export async function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));

    if (!args[0]) return msg.channel.send("Invalid syntax. Type `pls help config` to learn more.");

    return new Promise(resolve => {
        User.findOne({
            id: msg.author.id
        }, (err, user: UserModel) => {
            if (err) return msg.channel.send("Error while fetching your user data.");
    
            if (args[0] == "logs-api-key") {
                if (!args[1]) {
                    msg.channel.send("Missing API key. Type `pls help config` to learn more.");
                    return resolve();
                }

                user.logsTfApiKey = args[1];

                user.save().then(() => {
                    msg.channel.send(`Set log-api-key to \`${args[1]}\`.`);

                    resolve();
                }).catch(err => {
                    msg.channel.send("Error saving user data.");

                    resolve();
                });
            } else {
                msg.channel.send("Invalid config field. Type `pls help config` to learn more.")
            }
        });
    });
}