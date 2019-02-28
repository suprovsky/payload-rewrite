import { Bot } from "../../types";
import { Message } from "discord.js";
import config from "../../../secure-config";
import { getArgs, sliceCmd } from "../../utils/command-parsing";
import info from "../../config/info";
import { readFileSync } from "fs";
import { resolve } from "path";

export const name = "changelog";
export const description = "Retreives the changelog for the current version or [version]. Versions must follow the #.#.# format.";
export const usage = config.PREFIX + name + " [version]";
export const permissions = ["SEND_MESSAGES"];
export const canBeExecutedBy = ["SEND_MESSAGES"];
export const zones = ["text", "dm"];

export async function run(bot: Bot, msg: Message) {
    let args = getArgs(sliceCmd(msg, name));

    let version = args[0] || info.version;

    if (!version.match(/\d+\.\d+.\d+/)) return msg.channel.send("Invalid version.");

    let changelogText = readFileSync(resolve(__dirname, "../../../changelog.md"), { encoding: "utf8" });

    if (!changelogText.includes("### " + version)) return msg.channel.send("Version does not exist in changelog.");

    let versionRegExp = new RegExp(`### ${version.replace(/\./g, "\\.")}(\\n[^#]+)+`);
    console.log(versionRegExp);

    let changelog = (changelogText.match(versionRegExp) as RegExpMatchArray)[0];

    msg.channel.send("```md\n" + changelog + "\n```");
}