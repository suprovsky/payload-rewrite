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

export async function pushNotification(bot: Bot, id: string, level: number, embed: RichEmbed, update?: string): Promise<boolean> {
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

            if (user.notificationsLevel! >= level) {
                try {
                    if (update) {
                        if (user.latestUpdateNotifcation! == update) {
                            await saveUser(user);
                            return resolve(true);
                        }
                    }

                    let discordUser = await bot.fetchUser(id);
                    
                    await discordUser.send(embed);

                    if (update) {
                        user.latestUpdateNotifcation = update;
                    }

                    await saveUser(user);

                    resolve(true);
                } catch (err) {
                    resolve(false);
                }
            } else {
                await saveUser(user);

                resolve(true);
            }
        });
    });
}