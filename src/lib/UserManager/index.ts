import { User, UserModel } from "../../models/User";
import * as Discord from "discord.js";
import * as Mongoose from "mongoose";
import SteamID from "steamid";

export default class UserManager {
    discordClient: Discord.Client;

    constructor(bot: Discord.Client) {
        this.discordClient = bot;
    }

    async ensureUser(discordID: string) {
        let user: UserModel | null;
        user = await User.findOne({ id: discordID });

        if (!user) {
            user = new User({
                id: discordID
            });
        }

        return new UserEditable(user);
    }
}

export class UserEditable {
    user: UserModel;

    constructor(model: UserModel) {
        this.user = model;
    }

    static createSteamID(id: string): SteamID | null {
        let steamID = new SteamID(id);

        if (!steamID.isValid()) return null;

        return steamID;
    }

    setSteamID(steamID: SteamID): UserEditable {
        this.user.steamID = steamID.getSteamID64();

        return this;
    }

    setNotificationsLevel(level: NotificationsLevel): UserEditable {
        this.user.notificationsLevel = level;

        return this;
    }

    addCartFeet(miles: number) {
        this.user.fun = this.user.fun || {
            payloadFeetPushed: 0
        };

        this.user.fun.payloadFeetPushed = this.user.fun.payloadFeetPushed || 0;

        return this.user.fun.payloadFeetPushed += miles;
    }

    async refresh() {
        this.user = (await User.findOne({ id: this.user.id })) as UserModel;

        return this;
    }

    async save() {
        return await this.user.save();
    }
}

export enum NotificationsLevel {
    NONE,
    MAJOR,
    ALL
}