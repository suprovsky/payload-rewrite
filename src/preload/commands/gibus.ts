import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { createCanvas, loadImage } from "canvas";
import got from "got";
import AWS from "aws-sdk";
import path from "path";

export const name = "gibus";
export const description = "Gives an image a ghostly gibus. Must be used right after posting an image.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES", "ATTACH_FILES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    return new Promise(async resolve => {
        let messages = await msg.channel.fetchMessages({ limit: 5 });

        let img = messages.find(message => message.author.id == msg.author.id && message.attachments.size > 0);

        if (!img) {
            msg.channel.send("No image found.");
            return resolve();
        }

        let attachment = img.attachments.first();

        msg.channel.startTyping();

        let resp = await got(attachment.url, { encoding: null });

        const credentials = new AWS.SharedIniFileCredentials();
        AWS.config.credentials = credentials;
        AWS.config.update({ region: "us-east-1" });

        const rekognition = new AWS.Rekognition();

        rekognition.detectFaces({
            Image: {
                Bytes: resp.body
            }
        }, async (err, data) => {
            if (err) {
                console.log(err);
                return resolve();
            }
            if (!data.FaceDetails) return resolve();

            let canvas = createCanvas(attachment.width, attachment.height);
            let ctx = canvas.getContext("2d");

            let image = await loadImage(resp.body);
            let hat = await loadImage(path.resolve(__dirname, "../../assets/gibus.png"));

            ctx.drawImage(image, 0, 0);

            let headsFound = 0;

            data.FaceDetails.forEach(face => {
                if (!face.BoundingBox) return;
                if (!face.BoundingBox.Width || !face.BoundingBox.Height || !face.BoundingBox.Left || !face.BoundingBox.Top) return;

                headsFound++;

                let width = attachment.width * face.BoundingBox.Width;
                let height = attachment.height * face.BoundingBox.Height;
                let left = attachment.width * face.BoundingBox.Left;
                let top = attachment.height * face.BoundingBox.Top;

                ctx.drawImage(hat, left, top - height + (width * (269 / 272) / 2), width, width * (269 / 272));
            });

            if (!headsFound) {
                msg.channel.send("No valid face found.");
                return resolve();
            }

            await msg.channel.send({
                files: [canvas.toBuffer()]
            });

            resolve();
        });
    });
}