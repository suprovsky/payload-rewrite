import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import UserManager from "../../lib/UserManager";
import ServerManager from "../../lib/ServerManager";
import { weightedRandom } from "../../utils/random";
import { flash } from "../../utils/flash";

export const name = "pushcart";
export const description = "Pushes the cart.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text"];

export async function run(bot: Bot, msg: Message) {
    let userManager = bot.userManager
    let serverManager = bot.serverManager;

    let user = await userManager.getUser(msg.author.id);
    let server = await serverManager.getServer(msg.guild.id);

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

    let pushResult = user.addCartFeet(feetPushed);

    if (!pushResult) return flash(msg.channel.send("You must wait 5 minutes before pushing the cart again."), 5000);

    server.addCartFeet(feetPushed);

    await Promise.all([
        user.save(),
        server.save()
    ]);

    msg.channel.send(`<:payload:597506053021630464> Pushed the cart forward **${feetPushed}** feet (${server.server.fun!.payloadFeetPushed} total).`);
}