import { Command } from "../../../lib/Executables/Command";
import { Bot } from "../../../types/Bot";
import { Message } from "discord.js";
import { getPlayerData, RglApiResponse } from "../../../utils/rgl-api-helper";
import textTable from "text-table";
import SteamID from "steamid";

export default class PlayerCheck extends Command {
    constructor() {
        super(
            "playercheck",
            "Uses the output of the `status` command in a TF2 server to verify players' identities. The <league> argument can be any of the following:\n- rgl",
            "<league> <console output>"
        );
    }

    async run(bot: Bot, msg: Message): Promise<boolean> {
        const args = this.getArgs(msg);

        if (!args[0]) {
            return await this.fail(msg, "Missing `<league>` argument.");
        }

        let playerData: Array<{ nickname: string, id3: string }> = [];

        msg.content.split("\n").forEach(line => {
            if (!line.match(/# +\d+ +"(.+)" +(\[.+\]) +\d+:\d+ +\d+/)) return;

            let match = line.match(/# +\d+ +"(.+)" +(\[.+\]) +\d+:\d+ +\d+/) as RegExpMatchArray;
        
            playerData.push({
                nickname: match[1],
                id3: match[2]
            });
        });

        if (args[0] == "rgl") {
            let rglPlayerData: Array<RglApiResponse> = [];

            for(let i = 0; i < playerData.length; i++) {
                let id64: string;

                try {
                    id64 = (new SteamID(playerData[i].id3)).getSteamID64();
                } catch (err) {
                    id64 = "";
                }

                if (!id64) {
                    return await this.fail(msg, `Invalid Steam ID: \`${playerData[i].id3}\``);
                }

                let response = await getPlayerData(id64);
                response.PlayerHistory = response.PlayerHistory.slice(0, 5);

                rglPlayerData.push(response);
            }

            let tableData: Array<Array<string>> = [
                [ "", "RGL Alias", "Team", "Format", "W/L" ]
            ];

            rglPlayerData.forEach((player, playerIndex) => {
                player.PlayerHistory.forEach((entry, entryIndex) => {
                    if (entryIndex == 0) {
                        tableData.push([
                            playerData[playerIndex].nickname,
                            player.CurrentAlias,
                            player.SteamId,
                            entry.TeamName,
                            entry.RegionFormat,
                            `${entry.Wins}/${entry.Loses}`
                        ]);
                    } else {
                        tableData.push([
                            "",
                            "",
                            "",
                            entry.TeamName,
                            entry.RegionFormat,
                            `${entry.Wins}/${entry.Loses}`
                        ]);
                    }
                });
            });

            const table = textTable(tableData);
            let output = [""];
            table.split("\n").forEach(line => {
               if (output[output.length - 1].length > 1500) output.push("");

                output[output.length - 1] += line + "\n";
            });

            for (let i = 0; i < output.length; i++) {
                await this.respond(msg, "```" + output[i] + "```")
            }

            return true;
        } else {
            return await this.fail(msg, "This league is not currently supported.");
        }
    }
}