import { Bot } from "../../types";
import { Message, User as DiscordUser } from "discord.js";
import config from "../../../secure-config";
import got from "got";
import { User, UserModel } from "../../models/User";
import { render } from "../../utils/render-log";

export const name = "logs";
export const description = "Retrieves the latest log from a user's Steam ID. Only works if the user has their accounts linked.";
export const usage = config.PREFIX + name + " [SteamID]";
export const permissions = ["SEND_MESSAGES", "ATTACH_FILES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let target: DiscordUser;

    if (msg.mentions.users.size > 0) {
        target = msg.mentions.users.first();
    } else {
        target = msg.author;
    }

    User.findOne({
        id: target.id
    }, async (err, user: UserModel) => {
        if (err) return msg.channel.send("Error retrieving Steam ID. This is most likely a problem with the database.");

        if (!user || !user.steamID) return msg.channel.send("User does not have their Steam ID linked. Steam IDs can be linked to your account using `" + config.PREFIX + "link <SteamID>`.");
    
        let res = await got("http://logs.tf/api/v1/log?limit=1&player=" + user.steamID, {
            json: true
        });
        let data = res.body;

        let logID = data.logs[data.logs.length - 1].id;

        let placeholder = await msg.channel.send({
            files: [
                config.files.LOADING
            ]
        }) as Message;
    
        let screenshotBuffer = await render("http://logs.tf/" + logID + "#" + user.steamID);
        
        msg.channel.send({
            files: [screenshotBuffer]
        });
        placeholder.delete();
    });
}