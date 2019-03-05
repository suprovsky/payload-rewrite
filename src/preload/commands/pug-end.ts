import { Bot } from "../../types";
import { Message, VoiceChannel } from "discord.js";
import { Server, ServerModel } from "../../models/Server";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";

export const name = "pug-start";
export const description = "Moves all users from the waiting channel to the picking channel.";
export const usage = config.PREFIX + name;
export const permissions = ["ADMINISTRATOR"];
export const canBeExecutedBy = ["MOVE_MEMBERS"];
export const zones = ["text"];

export async function run(bot: Bot, msg: Message) {
    Server.findOne({
        id: msg.guild.id
    }, async (err, server: ServerModel) => {
        if (err) {
            console.warn(err);
            return msg.channel.send("Error retrieving server from database.");
        }

        if (!server || !server.pugging) {
            return msg.channel.send("This server has not been set up for pugging. View the getting started guide to pugging with Payload to learn more.");
        }

        let pugging = server.pugging;

        if (!pugging.blueTeamChannelID) return msg.channel.send("Blue team channel has not been set.");
        if (!pugging.redTeamChannelID) return msg.channel.send("Red team channel has not been set.");
        if (!pugging.waitingChannelID) return msg.channel.send("Waiting channel has not been set.");
        if (!pugging.pickingChannelID) return msg.channel.send("Picking channel has not been set.");
        if (!pugging.captainsChannelID) return msg.channel.send("Captains channel has not been set.");
        if (!pugging.newbieRoleID) return msg.channel.send("+1 role has not been set.");

        let channels = msg.guild.channels;

        if (!channels.has(pugging.blueTeamChannelID)) return msg.channel.send("Blue team channel couldn't be found. Try resetting it.");
        if (!channels.has(pugging.redTeamChannelID)) return msg.channel.send("Red team channel couldn't be found. Try resetting it.");
        if (!channels.has(pugging.waitingChannelID)) return msg.channel.send("Waiting channel couldn't be found. Try resetting it.");
        if (!channels.has(pugging.pickingChannelID)) return msg.channel.send("Picking channel couldn't be found. Try resetting it.");
        if (!channels.has(pugging.captainsChannelID)) return msg.channel.send("Captains channel couldn't be found. Try resetting it.");
        if (!msg.guild.roles.has(pugging.newbieRoleID)) return msg.channel.send("+1 role couldn't be found. Try resetting it.");

        let pickingChannel = channels.get(pugging.pickingChannelID) as VoiceChannel;
        let blueTeamChannel = channels.get(pugging.blueTeamChannelID) as VoiceChannel;
        let redTeamChannel = channels.get(pugging.redTeamChannelID) as VoiceChannel;

        let blueTeamChannelUserIDs = blueTeamChannel.members.map(member => member.id);
        let redTeamChannelUserIDs = redTeamChannel.members.map(member => member.id);

        for(let i = 0; i < blueTeamChannelUserIDs.length; i++) {
            let target = msg.guild.member(blueTeamChannelUserIDs[i]);

            await target.setVoiceChannel(pickingChannel);
        }

        for(let i = 0; i < redTeamChannelUserIDs.length; i++) {
            let target = msg.guild.member(redTeamChannelUserIDs[i]);

            await target.setVoiceChannel(pickingChannel);
        }
    });
}