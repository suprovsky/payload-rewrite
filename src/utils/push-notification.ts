import { Bot } from "../types/Bot";
import { RichEmbed } from "discord.js";

export async function pushNotification(bot: Bot, id: string, level: number, embed: RichEmbed, version?: string): Promise<boolean> {
    const userDBEntry = await bot.userManager.getUser(id);

    if (userDBEntry.user.notificationsLevel == undefined) {
        userDBEntry.user.notificationsLevel = 2;
    }
    if (userDBEntry.user.latestUpdateNotifcation == undefined) {
        userDBEntry.user.latestUpdateNotifcation = "0.0.0";
    }

    if (userDBEntry.user.notificationsLevel < level) {
        return false;
    }

    if (version && userDBEntry.user.latestUpdateNotifcation == version) {
        await userDBEntry.save();

        return false;
    }

    let discordUser = bot.users.get(id);
    if (!discordUser) {
        discordUser = await bot.fetchUser(id);
    }

    await discordUser.send(embed);

    if (version) {
        userDBEntry.user.latestUpdateNotifcation = version;
    }

    await userDBEntry.save();

    return true;
}