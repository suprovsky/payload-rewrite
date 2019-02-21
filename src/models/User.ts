import mongoose from "mongoose";

export type UserModel = mongoose.Document & {
    id?: string,

    steamID?: string,

    servers?: Array<{name: string, address: string, rconPassword: string}>
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