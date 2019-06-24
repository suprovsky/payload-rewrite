import { User, UserModel } from "../models/User";
import { Bot } from "../types/Bot";
import { RichEmbed } from "discord.js";

async function saveUser(user: UserModel): Promise<boolean> {
    return new Promise(resolve => {
        user.save().then(() => {
            resolve(true);
        }).catch(err => {
            resolve(false);
        });    
    });
}

export async function pushNotification(bot: Bot, id: string, level: number, embed: RichEmbed, version?: string): Promise<boolean> {
    return new Promise(resolve => {
        User.findOne({
            id
        }, async (err, user: UserModel) => {
            if (err) return resolve(false);
    
            if (!user) {
                user = new User({
                    id,
                    notificationsLevel: 2,
                    latestUpdateNotification: "0.0.0"
                });
            }

            if (!user.notificationsLevel) user.notificationsLevel = 2;
            if (!user.latestUpdateNotifcation) user.latestUpdateNotifcation = "0.0.0";

            if (user.notificationsLevel >= level) {
                console.log(`User notification level is ${user.notificationsLevel}/${level}.`);
                try {
                    if (version) {
                        if (user.latestUpdateNotifcation! == version) {
                            await saveUser(user);
                            return resolve(false);
                        }
                    }

                    let discordUser = bot.users.get(id);
                    if (!discordUser) discordUser = await bot.fetchUser(id);

                    await discordUser.send(embed);

                    if (version) {
                        user.latestUpdateNotifcation = version;
                    }

                    await saveUser(user);

                    resolve(true);
                } catch (err) {
                    resolve(false);
                }
            } else {
                await saveUser(user);

                resolve(false);
            }
        });
    });
}