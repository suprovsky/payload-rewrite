import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message, TextChannel } from "discord.js";
import xml2js from "xml2js";
import got from "got";
import { random } from "../../../utils/random";

export default class R34 extends Command {
    constructor() {
        super(
            "r34",
            "Finds an image on r34 based on search tags. **Only works in NSFW channels with pl_x in their topic.**",
            "<tag> [tag 2]...",
            ["SEND_MESSAGES", "EMBED_LINKS"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        if (msg.channel.type == "text") {
            if (!(msg.channel as TextChannel).nsfw) {
                return false;
            } else if (!(msg.channel as TextChannel).topic.includes("pl_x")) {
                return false;
            }
        }

        const args = this.getArgs(msg);

        msg.channel.startTyping();

        return new Promise(async resolve => {
            try {
                let initialResp = await got("https://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=0&tags=" + args.join("+"));
                let totalPostCount = (initialResp.body.match(/count="(\d+)"/) as RegExpMatchArray)[1];
    
                let pageNum = random(0, Number(totalPostCount) / 3 - 1);
    
                let resp = await got("https://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=3&pid=" + pageNum + "&tags=" + args.join("+"));
    
                let xml = resp.body;
    
                xml2js.parseString(xml, async (err, data) => {
                    if (err || !data.posts) {
                        return resolve(await this.fail(msg, "Error retrieving posts from r34."));
                    }
    
                    if (data.posts.$.count == 0) {
                        return resolve(await this.fail(msg, "No results found."));
                    }

                    let bestScored = {url: "", score: -1};
                    data.posts.post.forEach((post: any) => {
                        if (post.$.score > bestScored.score) bestScored = {
                            url: post.$.file_url,
                            score: Number(post.$.score)
                        };
                    });
    
                    await this.respond(msg, bestScored.url);

                    resolve(true);
                });
            } catch (err) {
                resolve(await this.fail(msg, "Error retrieving posts from r34."));
            }
        });
    }
}