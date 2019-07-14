import { Command } from "../../../../lib/Executables/Command";
import { Bot } from "../../../../types/Bot";
import { Message, RichEmbed } from "discord.js";
import { Server, ServerModel } from "../../../../models/Server";
import { qSort } from "../../../../utils/sort";

export default class Servers extends Command {
    constructor() {
        super(
            "servers",
            "Shows the top 5 pushcart servers.",
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            ["pushcart"]
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        msg.channel.startTyping();

        let servers: ServerModel[] = await Server.find({
            "fun.payloadFeetPushed": {
                $exists: true
            }
        });
    
        let leaderboard = qSort(servers.map(server => {
            return {
                id: server.id,
                pushed: server.fun!.payloadFeetPushed
            };
        }), (serverA, serverB) => {
            return serverB.pushed - serverA.pushed;
        });

        const top5 = leaderboard.slice(0, 5);

        let leaderboardString = "```md\n";

        for (let i = 0; i < top5.length; i++) {
            let identifier = (bot.guilds.get(top5[i].id) || { name: top5[i].id }).name;

            if (top5[i].id == msg.author.id) {
                leaderboardString += `> ${i + 1}: ${identifier} (${top5[i].pushed})\n`;
            } else {
                leaderboardString += `${i + 1}: ${identifier} (${top5[i].pushed})\n`;
            }
        }

        leaderboardString += "```";

        await msg.channel.send(new RichEmbed({
            title: "Pushcart Server Leaderboard",
            description: leaderboardString
        }));

        return true;
    }
}