import { Bot } from "../../types";
import { Message, User } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";
import got from "got";
import { User as DBUser, UserModel } from "../../models/User";
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

    if (!map || map.match(/logs\.tf\/\d+/)) return msg.channel.send("Invalid syntax. Make sure to specify the map and title before the log URLs. Type `pls help combine` to learn more.");
    if (!title || title.match(/logs\.tf\/\d+/)) return msg.channel.send("Invalid syntax. Make sure to specify the map and title before the log URLs. Type `pls help combine` to learn more.");
    if (logs.length < 2) return msg.channel.send("Invalid syntax. Make sure to specify the map and title before the log URLs. Type `pls help combine` to learn more.");

    let ids: Array<string> = [];
    for(let i = 0; i < logs.length; i++) {
        let id = logs[i].match(/\d+/) as RegExpMatchArray;

        if (!id) return msg.channel.send(`\`${logs[i]}\` is not a valid log.`);

        ids.push(id[0]);
    }

    msg.channel.startTyping();

    return new Promise(resolve => {
        DBUser.findOne({
            id: msg.author.id
        }, (err, user: UserModel) => {
            if (err) {
                msg.channel.send("Error while fetching your user data.");
                return resolve();
            }

            if (!user) {
                user = new DBUser({
                    id: msg.author.id
                });
            }

            if (!user.logsTfApiKey) {
                msg.channel.send("You have not set a logs.tf API key. Type `pls help config` to find out more.");
                return resolve();
            }

            let requestBody = {
                token: user.logsTfApiKey,
                title: title,
                map: map,
                ids: ids
            };

            got("https://sharkyy.io/api/logify/v3", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                json: true,
                body: requestBody
            }).then(async res => {
                if (!res.body.success) {
                    msg.channel.send("Error combining logs.");
                    return resolve();
                }

                msg.channel.send("**Done!** http://logs.tf/" + res.body.log_id);

                let screenshotBuffer = await render("http://logs.tf/" + res.body.log_id);

                msg.channel.send({
                    files: [screenshotBuffer]
                });
                resolve();
            }).catch(err => {
                console.log(err);
                msg.channel.send("Error combining logs.");
                resolve();
            });
        });
    });
}