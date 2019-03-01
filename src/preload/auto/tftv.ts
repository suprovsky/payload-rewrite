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
    const date = $post.find(".post-footer .js-date-toggle").attr("title").replace(/at (\d+:\d+).+$/, "$1");

    let embed = new RichEmbed();
        embed.setTitle(title);
        embed.setURL("https://" + matchMsg(msg));
        embed.addField(author, (body.length > 500 ? body.slice(0, 500) + "..." : body) + "\n[read more](https://" + matchMsg(msg) + ")");
        embed.setFooter(`${frags} frags`);
        embed.setTimestamp(new Date(date));

    msg.channel.send(embed);
}

function matchMsg(msg: Message) {
    let match = msg.content.match(pattern) as RegExpMatchArray;

    return match[0];
}