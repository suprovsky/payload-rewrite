import mongoose from "mongoose";

export type Servers = Array<{name: string, address: string, rconPassword: string}>;

export type UserModel = mongoose.Document & {
    id?: string,

    steamID?: string,

    servers?: Servers
};

const userSchema = new mongoose.Schema({
    id: String,

    steamID: String,

    servers: [{
        name: String,
        address: String,
        rconPassword: String
    }]
});

export const User = mongoose.model("User", userSchema);