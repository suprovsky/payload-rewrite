import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import UserManager from "../../lib/UserManager";
import ServerManager from "../../lib/ServerManager";
import { random } from "../../utils/random";

export const name = "pushcart";
export const description = "Pushes the cart.";
export const usage = config.PREFIX + name;
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let userManager = new UserManager(bot);
    let serverManager = new ServerManager(bot);

    let pushMessage = (await msg.channel.send("Pushing the cart...")) as Message;
    msg.channel.startTyping();

    let user = await userManager.ensureUser(msg.author.id);
    let server = await serverManager.ensureServer(msg.guild.id);

    let feetPushed = random(8, 12);

    user.addCartMiles(feetPushed / 5280);
    server.addCartMiles(feetPushed / 5280);

    await Promise.all([
        user.save(),
        server.save()
    ]);

    pushMessage.delete();
    msg.channel.send(`<:payload:597506053021630464> Pushed the cart forward **${feetPushed}** feet (${Math.round(5280 * server.server.fun!.payloadMilesPushed)} total).`);
}