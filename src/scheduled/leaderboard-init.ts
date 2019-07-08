import { Bot } from "../types/Bot";
import { Bot as BotDoc, BotModel } from "../models/Bot";
import { run as runLeaderboardUpdate } from "./leaderboard";

export const every = -1;

export async function run(bot: Bot) {
    let botDoc: BotModel | null = await BotDoc.findOne({
        id: 0
    });

    if (!botDoc || !botDoc.leaderboard) return;

    bot.leaderboard = {
        users: botDoc.leaderboard.pushcart.users,
        updated: botDoc.leaderboard.pushcart.updated
    };

    runLeaderboardUpdate(bot);

    console.log("Pulled leaderboard from db.");
}