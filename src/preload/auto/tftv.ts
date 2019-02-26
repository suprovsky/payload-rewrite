import { Bot } from "../../types";
import { Message, RichEmbed } from "discord.js";
import got from "got";
import htmlToText from "html-to-text";
import cheerio from "cheerio";

export const name = "tftv";
export const description = "Created thread previews for TFTV threads.";
export const pattern = /teamfortress\.tv\/\d+\/[\w-]+/;
export const permissions = ["SEND_MESSAGES", "EMBED_LINKS"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    const resp = await got("https://" + matchMsg(msg));
    const $ = cheerio.load(resp.body);

    const frags = $("#thread-frag-count").text().trim();
    const title = $(".thread-header-title").text().trim();
    const $post = $("#thread-container > .post:first-child");
    const author = $post.find(".post-header .post-author").text().trim();
    const body = htmlToText.fromString($post.find(".post-body").html() as string, {
        ignoreImage: true
    });

    let embed = new RichEmbed();
        embed.setAuthor("by " + author, "https://yt3.ggpht.com/a-/AAuE7mCQ_tSDWtAXQXehczA4eq3x7d5mPobERTUnhA=s900-mo-c-c0xffffffff-rj-k-no");
        embed.setTitle(title);
        embed.setDescription("```" + (body.length > 500 ? body.slice(0, 500) + "..." : body) + "```");
        embed.setFooter(`${frags} frags`);
        embed.setTimestamp();

    msg.channel.send(embed);
}

function matchMsg(msg: Message) {
    let match = msg.content.match(pattern) as RegExpMatchArray;

    return match[0];
}