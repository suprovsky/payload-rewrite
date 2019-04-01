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
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    return new Promise(async resolve => {
        let testString = msg.content.slice(config.PREFIX.length + name.length).trim();

        let steamIDTestResult = await ensureSteamID(testString);

        if (!steamIDTestResult) {
            msg.channel.send(`\`${testString}\` is not a valid Steam ID.`);
            return resolve();
        }

        User.findOne({
            id: msg.author.id
        }, (err, user: UserModel) => {
            if (err) {
                msg.channel.send("Error linking your Discord and Steam accounts. This is most likely a problem with the database.");
                return resolve();
            }

            if (!user) {
                user = new User({
                    id: msg.author.id,
                    steamID: steamIDTestResult
                });

                user.save(err => {
                    if (err) {
                        msg.channel.send("Error linking your Discord and Steam accounts. This is most likely a problem with the database.");
                        return resolve();
                    }

                    msg.channel.send(`Successfully linked \`${steamIDTestResult}\` to \`${msg.author.tag}\`.`);
                });
            } else {
                user.steamID = steamIDTestResult;

                user.save(err => {
                    if (err) {
                        msg.channel.send("Error linking your Discord and Steam accounts. This is most likely a problem with the database.");
                        return resolve();
                    }

                    msg.channel.send(`Successfully overrode old Steam ID with \`${steamIDTestResult}\` for \`${msg.author.tag}\`.`);

                    resolve();
                });
            }
        });
    });
}