import { Bot } from "../../types";
import { Message, StreamDispatcher, RichEmbed } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";
import { AudioPlayerControls } from "../../utils/interactable-embed";
import ytsearch from "youtube-search";
import ytdl, { videoInfo } from "ytdl-core";

export const name = "music";
export const description = "Plays a song from youtube. This command is in early beta so don't expect everything to work.";
export const usage = `${config.PREFIX}${name} <url | name>`;
export const permissions = ["SEND_MESSAGES", "CONNECT", "SPEAK"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text"];

export async function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));

    if (!args[0]) return msg.channel.send("Missing <url | name> argument.");

    if (!msg.member.voiceChannel) return msg.channel.send("You must be in a voice channel to use this command.");
    if (!msg.member.voiceChannel.joinable) return msg.channel.send("I can't join your voice channel 😞.");

    if (bot.cache.music[msg.guild.id] && bot.cache.music[msg.guild.id].isPlaying) return msg.channel.send("Someone else is listening to a song.");

    let connection = await msg.member.voiceChannel.join();
    if (!bot.cache.music[msg.guild.id]) bot.cache.music[msg.guild.id] = {};

    let url: string;

    if (!args[0].match(/https?:\/\/(\w+\.)+\w+\/?$/)) {
        let res = await ytsearch(args[0], {
            maxResults: 1,
            key: config.GOOGLE_API_KEY
        });

        if (res.results.length == 0) return msg.channel.send("No search results for `" + args[0] + "`.");
    
        url = res.results[0].link;
    } else {
        url = args[0];
    }

    let audioStream = ytdl(url, {
        filter: "audioonly"
    }).on("error", err => {
        msg.channel.send("Error playing song.");
    });

    let videoData: videoInfo | undefined;
    let dispatcher: StreamDispatcher | undefined;
    let audioPlayer: AudioPlayerControls | undefined;

    try {
        videoData = await ytdl.getBasicInfo(url);

        dispatcher = connection.playStream(audioStream);

        let embed = new RichEmbed();
            embed.setTitle(videoData.title);
            embed.setDescription(`Length: ${formatSeconds(Number(videoData.length_seconds))}`);
            embed.setThumbnail(videoData.thumbnail_url);

        let embedMsg = await msg.channel.send(embed);

        audioPlayer = new AudioPlayerControls(bot, msg.member.voiceChannel, msg, embedMsg as Message, connection, dispatcher);
        audioPlayer.startListening();

        bot.cache.music[msg.guild.id].isPlaying = true;

        dispatcher.on("end", () => {
            bot.cache.music[msg.guild.id].isPlaying = false;
            if (!audioPlayer) return;

            audioPlayer.end();
        });
    } catch (err) {
        console.error(err);

        if (dispatcher) dispatcher.end();
        if (audioPlayer) audioPlayer.end();
        msg.member.voiceChannel.leave();

        bot.cache.music[msg.guild.id].isPlaying = false;
    }
}

function formatSeconds(seconds: number) {
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

const VALID_ARGUMENTS = ["play"];