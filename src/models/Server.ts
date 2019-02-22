import mongoose from "mongoose";
import { Message } from "discord.js";

export type ServerMentionsObject = {
    [channelID: string]: Array<Message>
}

export type ServerModel = mongoose.Document & {
    id?: string,

    disabled?: Array<{channelID: string, commands: Array<string>}>,

    pugging?: {
        newbieRoleID: string,

        waitingChannelID: string,
        pickingChannelID: string,
        redTeamChannelID: string,
        blueTeamChannelID: string,
        captainsChannelID: string
    },

    mentions?: ServerMentionsObject
};

const serverSchema = new mongoose.Schema({
    id: String,

    disabled: [{
        channelID: String,
        commands: [String]
    }],

    pugging: {
        newbieRoleID: String,

        waitingChannelID: String,
        pickingChannelID: String,
        redTeamChannelID: String,
        blueTeamChannelID: String,
        captainsChannelID: String
    },

    mentions: Object
});

export const Server = mongoose.model("Server", serverSchema);