import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import UserManager from "../../lib/UserManager";
import ServerManager from "../../lib/ServerManager";
import { weightedRandom } from "../../utils/random";

export const name = "pushcart";
export const description = "Pushes the cart.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text"];

export async function run(bot: Bot, msg: Message) {
    let userManager = new UserManager(bot);
    let serverManager = new ServerManager(bot);

    let pushMessage = (await msg.channel.send("Pushing the cart...")) as Message;
    msg.channel.startTyping();

    let user = await userManager.ensureUser(msg.author.id);
    let server = await serverManager.ensureServer(msg.guild.id);

    let feetPushed = weightedRandom([
        { number: 3, weight: 1 },
        { number: 4, weight: 2 },
        { number: 5, weight: 4 },
        { number: 6, weight: 8 },
        { number: 7, weight: 16 },
        { number: 8, weight: 16 },
        { number: 9, weight: 16 },
        { number: 10, weight: 16 },
        { number: 11, weight: 18 },
        { number: 12, weight: 18 },
        { number: 13, weight: 16 },
        { number: 14, weight: 8 },
        { number: 15, weight: 4 },
        { number: 16, weight: 2 },
        { number: 17, weight: 1 },
    ]);

    user.addCartFeet(feetPushed);
    server.addCartFeet(feetPushed);

    await Promise.all([
        user.save(),
        server.save()
    ]);

    pushMessage.delete();
    msg.channel.send(`<:payload:597506053021630464> Pushed the cart forward **${feetPushed}** feet (${server.server.fun!.payloadFeetPushed} total).`);
}