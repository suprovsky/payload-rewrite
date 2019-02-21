import mongoose from "mongoose";
import { LogData } from "../types";

export type Servers = Array<{name: string, address: string, rconPassword: string}>;

export type UserModel = mongoose.Document & {
    id?: string,

    steamID?: string,

    servers?: Servers,

    logs?: Array<LogData>
};

const userSchema = new mongoose.Schema({
    id: String,

    steamID: String,

    servers: [{
        name: String,
        address: String,
        rconPassword: String
    }],

    logs: [Object]
});

export const User = mongoose.model("User", userSchema);