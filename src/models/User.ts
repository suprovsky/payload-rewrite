import mongoose from "mongoose";

export type UserModel = {
    id: string,

    steamID: number
};

const userSchema = new mongoose.Schema({
    id: String,

    steamID: Number
});

export const User = mongoose.model("User", userSchema);