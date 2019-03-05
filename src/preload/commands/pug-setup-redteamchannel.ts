import { Bot } from "../../types";
import { Message } from "discord.js";
import { Server, ServerModel } from "../../models/Server";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";

export const name = "pug-red";
export const description = "Sets a channel to be the designated red team channel.";
export const usage = config.PREFIX + name + " <channel name>";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["ADMINISTRATOR"];
export const zones = ["text"];

export async function run(bot: Bot, msg: Message) {
    const args = getArgs(sliceCmd(msg, name));

    if (!args[0]) return msg.channel.send("Missing <channel name> argument.");

    let channel = msg.guild.channels.find(channel => channel.name == args[0] && channel.type == "voice");

    if (!channel) return msg.channel.send("Channel not found. Did you type the name correctly?");

    Server.findOne({
        id: msg.guild.id
    }, (err, server: ServerModel) => {
        if (err) {
            console.warn(err);
            return msg.channel.send("Error retrieving server from database.");
        }

        if (!server) {
            server = new Server({
                id: msg.guild.id,
                pugging: {}
            });
        }

        (server.pugging as any).redTeamChannelID = channel.id;

        server.save(err => {
            if (err) {
                console.warn(err);
                return msg.channel.send("Error saving data to database.");
            }

            msg.channel.send("Set red team channel to `" + channel.name + "`.");
        });
    });
}