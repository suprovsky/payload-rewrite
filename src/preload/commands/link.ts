import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { User, UserModel } from "../../models/User";
import { ensureSteamID } from "../../utils/steam-id";

export const name = "link";
export const description = "Links your steam account to your Discord account.";
export const usage = config.PREFIX + name + " <SteamID>";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];

export async function run(bot: Bot, msg: Message) {
    let testString = msg.content.slice(config.PREFIX.length + name.length).trim();

    let steamIDTestResult = await ensureSteamID(testString);

    if (!steamIDTestResult) return msg.channel.send(`\`${testString}\` is not a valid Steam ID.`);

    User.findOne({
        id: msg.author.id
    }, (err, user: UserModel) => {
        if (err) return msg.channel.send("Error linking your Discord and Steam accounts. This is most likely a problem with the database.");

        if (!user) {
            user = new User({
                id: msg.author.id,
                steamID: steamIDTestResult
            });

            user.save(err => {
                if (err) return msg.channel.send("Error linking your Discord and Steam accounts. This is most likely a problem with the database.");

                msg.channel.send(`Successfully linked \`${steamIDTestResult}\` to \`${msg.author.tag}\`.`);
            });
        } else {
            user.steamID = steamIDTestResult;

            user.save(err => {
                if (err) return msg.channel.send("Error linking your Discord and Steam accounts. This is most likely a problem with the database.");

                msg.channel.send(`Successfully overrode old Steam ID with \`${steamIDTestResult}\` for \`${msg.author.tag}\`.`);
            });
        }
    });
}