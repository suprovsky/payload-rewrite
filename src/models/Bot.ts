import mongoose from "mongoose";

export type BotModel = mongoose.Document & {
    id?: 0,

    leaderboard?: {
        pushcart: {
            users: Array<{ id: string, pushed: number }>,
            updated: Date
        }
    },

    startupVersion?: string
};

const botSchema = new mongoose.Schema({
    id: Number,

    leaderboard: {
        pushcart: {
            users: [{
                id: String,
                pushed: Number
            }],
            updated: Date
        }
    },

    startupVersion: String
});

export const Bot = mongoose.model("Bot", botSchema);