import mongoose from "mongoose";
import SteamID from "steamid";
import { LogData } from "../types";

type Steam3IDFunction = () => string | undefined;

export type Servers = Array<{name: string, address: string, rconPassword: string}>;

export type UserModel = mongoose.Document & {
    id?: string,

    steamID?: string,
    getSteam3ID?: Steam3IDFunction,

    notificationsLevel?: number,
    latestUpdateNotifcation?: string,

    logsTfApiKey?: string,

    servers?: Servers,

    logs?: Array<LogData>
};

const userSchema = new mongoose.Schema({
    id: String,

    steamID: String,

    notificationsLevel: Number,
    latestUpdateNotifcation: String,

    logsTfApiKey: String,

    servers: [{
        name: String,
        address: String,
        rconPassword: String
    }],

    logs: [Object]
});

userSchema.methods.getSteam3ID = function() {
    if (!this.steamID) return undefined;

    let steamID = new SteamID(this.steamID);

    return steamID.steam3();
};

export const User = mongoose.model("User", userSchema);