import mongoose from "mongoose";

export type UserModel = mongoose.Document & {
    id?: string,

    steamID?: string
};

const userSchema = new mongoose.Schema({
    id: String,

    steamID: String
});

export const User = mongoose.model("User", userSchema);