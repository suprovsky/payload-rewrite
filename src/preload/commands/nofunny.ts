import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { createCanvas, loadImage } from "canvas";
import got from "got";
import AWS from "aws-sdk";

export const name = "nofunny";
export const description = "Removes an iFunny watermark from an image. Must be used right after posting an image.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let messages = await msg.channel.fetchMessages({ limit: 5 });

    let img = messages.find(message => message.author.id == msg.author.id && message.attachments.size > 0);
    let attachment = img.attachments.first();

    if (!img) return msg.channel.send("No image found.");

    msg.channel.startTyping();

    let resp = await got(attachment.url, { encoding: null });

    let canvas = createCanvas(attachment.width, attachment.height - 24);
    let ctx = canvas.getContext("2d");

    let image = await loadImage(resp.body);

    ctx.drawImage(image, 0, 0);

    await msg.channel.send({
        files: [canvas.toBuffer()]
    });
}