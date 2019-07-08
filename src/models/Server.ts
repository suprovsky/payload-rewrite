import mongoose from "mongoose";
import { Message } from "discord.js";

export type ServerModel = mongoose.Document & {
    id?: string,

    commandRestrictions?: Array<{channelID: string, commands: Array<string>}>,
    fun?: {
        payloadFeetPushed: number,
        payloadBeingDefended: boolean,
        payloadDefendTimeout: number
    }

    pugging?: {
        newbieRoleID: string,

        waitingChannelID: string,
        pickingChannelID: string,
        redTeamChannelID: string,
        blueTeamChannelID: string,
        captainsChannelID: string
    }
};

const serverSchema = new mongoose.Schema({
    id: String,

    commandRestrictions: [{
        channelID: String,
        commands: [String]
    }],

    fun: {
        payloadFeetPushed: Number,
        payloadBeingDefended: Boolean,
        payloadDefendTimeout: Number
    },

    pugging: {
        newbieRoleID: String,

        waitingChannelID: String,
        pickingChannelID: String,
        redTeamChannelID: String,
        blueTeamChannelID: String,
        captainsChannelID: String
    }
});

export const Server = mongoose.model("Server", serverSchema);