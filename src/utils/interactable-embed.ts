import { Message, MessageReaction, User, StreamDispatcher, VoiceConnection, VoiceChannel } from "discord.js";
import ytdl from "ytdl-core";
import { YouTubeSearchResults } from "youtube-search";
import { Bot } from "../types";

export interface VideoData {
    thumbnail: string;
    length: number;
    link: string;
    title: string;
}

export class AudioPlayerControls {
    _bot: Bot;
    _voiceChannel: VoiceChannel
    _originalMessage: Message;
    _controlsMessage: Message;
    _connection: VoiceConnection;
    _dispatcher: StreamDispatcher;
    _dj: User;

    EMOJIS: {
        [emojiName: string]: string;

        rewind: "⏪",
        arrow_forward: "▶",
        pause_button: "⏸",
        fast_forward: "⏩",
        stop_button: "⏹",
    };

    constructor(bot: Bot, voiceChannel: VoiceChannel, originalMessage: Message, controlsMessage: Message, connection: VoiceConnection, dispatcher: StreamDispatcher) {
        this.EMOJIS = {
            rewind: "⏪",
            arrow_forward: "▶",
            pause_button: "⏸",
            fast_forward: "⏩",
            stop_button: "⏹",
        };

        this._bot = bot;
        this._voiceChannel = voiceChannel;
        this._originalMessage = originalMessage;
        this._controlsMessage = controlsMessage;
        this._connection = connection;
        this._dispatcher = dispatcher;
        this._dj = originalMessage.author;

        controlsMessage.react(this.EMOJIS.rewind).then(() => {
            controlsMessage.react(this.EMOJIS.arrow_forward);
        }).then(() => {
            controlsMessage.react(this.EMOJIS.pause_button);
        }).then(() => {
            controlsMessage.react(this.EMOJIS.fast_forward);
        }).then(() => {
            controlsMessage.react(this.EMOJIS.stop_button);
        });
    }

    _handleEmojiChange = (emojiName: string) => {
        let reaction = this._controlsMessage.reactions.find(reaction => reaction.emoji.name == emojiName);

        if (reaction && reaction.me) {
            reaction.remove();
        } else {
            this._controlsMessage.react(reaction.emoji);
        }
    }

    _handleReaction = (reaction: MessageReaction, user: User) => {
        if (user.id != this._dj.id) return;
        
        if (reaction.emoji.name == this.EMOJIS.stop_button) {
            this.end();
            this._handleEmojiChange(this.EMOJIS.stop_button);

        } else if (reaction.emoji.name == this.EMOJIS.rewind) {
            reaction.message.channel.send("Rewind.");
            this._handleEmojiChange(this.EMOJIS.rewind);

        } else if (reaction.emoji.name == this.EMOJIS.arrow_forward) {
            if (this._dispatcher.paused) this._dispatcher.resume();
            this._handleEmojiChange(this.EMOJIS.arrow_forward);

        } else if (reaction.emoji.name == this.EMOJIS.pause_button) {
            if (!this._dispatcher.paused) this._dispatcher.pause();
            this._handleEmojiChange(this.EMOJIS.pause_button);

        } else if (reaction.emoji.name == this.EMOJIS.fast_forward) {
            reaction.message.channel.send("Fast-forward.");
            this._handleEmojiChange(this.EMOJIS.fast_forward);
        }
    }

    startListening = () => {
        this._bot.on("messageReactionAdd", this._handleReaction);
        this._bot.on("messageReactionRemove", this._handleReaction);
    }

    end = () => {
        this._bot.removeListener("messageReactionAdd", this._handleReaction);
        this._bot.removeListener("messageReactionRemove", this._handleReaction);
        this._dispatcher.end();
        this._connection.disconnect();
        this._voiceChannel.leave();
        this._controlsMessage.delete();

        this._bot.cache.music[this._originalMessage.guild.id].isPlaying = false;
    }
}