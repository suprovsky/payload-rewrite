import { Bot } from "../../types";
import { Message } from "discord.js";
import { Server, ServerModel } from "../../models/Server";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";

export const name = "pug-plusone";
export const description = "Sets a role to be the +1 role.";
export const usage = config.PREFIX + name + " <role name>";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["ADMINISTRATOR"];
export const zones = ["text"];

export async function run(bot: Bot, msg: Message) {
    const args = getArgs(sliceCmd(msg, name));

    if (!args[0]) return msg.channel.send("Missing <role name> argument.");

    let role = msg.guild.roles.find(role => role.name == args[0]);

    if (!role) return msg.channel.send("Role not found. Did you type the name correctly?");

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

        (server.pugging as any).newbieRoleID = role.id;

        server.save(err => {
            if (err) {
                console.warn(err);
                return msg.channel.send("Error saving data to database.");
            }

            msg.channel.send("Set +1 role to `" + role.name + "`.");
        });
    });
}