import { Bot } from "../../types";
import { Message, TextChannel } from "discord.js";
import config from "../../../secure-config";
import xml2js from "xml2js";
import got from "got";
import { sliceCmd, getArgs } from "../../utils/command-parsing";
import { random } from "../../utils/random";

export const name = "r34";
export const description = "Finds an image on r34 based on search tags. Only works in NSFW channels with pl_x in their topic.";
export const usage = config.PREFIX + name + " [tag 1] [tag 2]...";
export const permissions = ["SEND_MESSAGES", "EMBED_LINKS"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    if (!(msg.channel as TextChannel).nsfw) return;

    if (!(msg.channel as TextChannel).topic.includes("pl_x")) return msg.channel.send("This command cannot be executed in this channel. Use `" + config.PREFIX + "help " + name + "` to see how to allow this command here.");

    let args = getArgs(sliceCmd(msg, name)).map(arg => arg.replace(/ +/g, "_"));

    return new Promise(async resolve => {
        let initialResp = await got("https://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=0&tags=" + args.join("+"));
        let totalPostCount = (initialResp.body.match(/count="(\d+)"/) as RegExpMatchArray)[1];
        let pageNum = random(0, Number(totalPostCount) / 100);

        let resp = await got("https://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=100&pid=" + pageNum + "&tags=" + args.join("+"));

        let xml = resp.body;

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