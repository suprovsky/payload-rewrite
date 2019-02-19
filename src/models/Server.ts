import mongoose from "mongoose";

export type ServerModel = {
    id: string,

    disabled: Array<{channelID: string, commands: Array<string>}>
};

const serverSchema = new mongoose.Schema({
    id: String,

    disabled: [{
        channelID: String,
        commands: [String]
    }]
});

export const Server = mongoose.model("Server", serverSchema);