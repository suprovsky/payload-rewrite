import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";
import { getPlayerData, RglApiResponse } from "../../utils/rgl-api-helper";
import textTable from "text-table";
import SteamID from "steamid";

export const name = "playercheck";
export const description = "Uses the output of the status command in a TF2 server to verify players' identities. The <league> argument can be any of the following:\n- rgl";
export const usage = config.PREFIX + name + " <league>";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));

    if (!args[0]) return msg.channel.send("Missing <league> argument.");

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

            if (!id64) return msg.channel.send(`Invalid Steam ID: \`${playerData[i].id3}\``)

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

        output.forEach(messageBlock => {
            msg.channel.send("```" + messageBlock + "```");
        });
    } else {
        msg.channel.send("This league is not currently supported.");
    }
}