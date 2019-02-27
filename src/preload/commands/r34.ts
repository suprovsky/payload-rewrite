import { Bot } from "../../types";
import { Message, TextChannel } from "discord.js";
import config from "../../../secure-config";
import xml2js from "xml2js";
import got from "got";
import { sliceCmd } from "../../utils/command-parsing";

export const name = "r34";
export const description = "Finds an image on r34 based on search tags. Only works in NSFW channels with pl_x in their topic.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES", "EMBED_LINKS"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    if (!(msg.channel as TextChannel).nsfw) return;

    if (!(msg.channel as TextChannel).topic.includes("pl_x")) return msg.channel.send("This command cannot be executed in this channel. Use `" + config.PREFIX + "help " + name + "` to see how to allow this command here.");

    return new Promise(async resolve => {
        let resp = await got("https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=" + sliceCmd(msg, name).replace(/ +/g, "+"));

        let xml = resp.body;
        console.log(resp.requestUrl);

        xml2js.parseString(xml, (err, data) => {
            if (err) {
                msg.channel.send("Error retrieving posts from r34.");
                return resolve();
            }

            if (data.posts.$.count == 0) {
                msg.channel.send("No results found.");
                return resolve();
            }

            let bestScored = {url: "", score: -1};
            data.posts.post.forEach((post: any) => {
                if (post.$.score > bestScored.score) bestScored = {
                    url: post.$.file_url,
                    score: Number(post.$.score)
                };
            });

            msg.channel.send(bestScored.url);
            resolve();
        });
    });
}