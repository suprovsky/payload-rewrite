import { Bot } from "../types/Bot";
import { User, UserModel } from "../models/User";

export const every = 1000 * 60 * 5;

export async function run(bot: Bot) {
    let sortedUsers: UserModel[] = await User.find({
        "fun.payloadFeetPushed": {
            $exists: true
        }
    }).sort({
        "fun.payloadFeetPushed": -1
    });

    let leaderboard = sortedUsers.map(user => {
        return {
            id: user.id,
            pushed: user.fun!.payloadFeetPushed
        };
    });

    bot.leaderboard = {
        users: leaderboard,
        updated: new Date()
    };
}