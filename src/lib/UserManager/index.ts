import { User, UserModel } from "../../models/User";
import * as Discord from "discord.js";
import SteamID from "steamid";

export default class UserManager {
    discordClient: Discord.Client;
    users: Map<string, UserEditable>;

    constructor(bot: Discord.Client) {
        this.discordClient = bot;
        this.users = new Map();
    }

    async getUser(discordID: string) {
        return this.users.get(discordID) || this.ensureUser(discordID);
    }

    async ensureUser(discordID: string) {
        let user: UserModel | null;
        user = await User.findOne({ id: discordID });

        if (!user) {
            user = new User({
                id: discordID
            });
        }

        let userEditable = new UserEditable(user);
        this.users.set(discordID, userEditable);

        return userEditable;
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

    addCartFeet(feet: number) {
        this.user.fun = this.user.fun || {
            payload: {
                feetPushed: 0,
                pushing: false,
                lastPushed: 0
            }
        };

        this.user.fun.payload = this.user.fun.payload || {
            feetPushed: 0,
            pushing: false,
            lastPushed: 0
        }

        this.user.fun.payload.feetPushed = this.user.fun.payload.feetPushed || 0;

        this.user.fun.payload.pushing = false;

        if (this.user.fun.payload.pushing || Date.now() - this.user.fun.payload.feetPushed < 1000 * 60 * 5) {
            return false;
        }

        this.user.fun.payload.feetPushed += feet;
        this.user.fun.payload.lastPushed = Date.now();

        return true;
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