import { describe, it } from "mocha";
import { expect } from "chai";
import handleCommand from "../../src/utils/handle-command";
import { Collection, Message } from "discord.js";
import { Bot } from "../../src/types";
import config from "../../example-config";

describe("handleCommand", () => {
    let bot: Bot = {
        commands: new Collection()
    } as Bot;
    let botMessage: Message = {
        author: {
            bot: false
        }
    } as Message;
    let userMessage: Message = {
        author: {
            bot: false
        },
        content: config.PREFIX + "do stuff"
    } as Message;

    it("should not run a command sent by a bot", () => {
        expect(handleCommand(bot, botMessage)).to.equal(false);
    });
    it("should not run a command that doesn't exist", () => {
        expect(handleCommand(bot, userMessage)).to.equal(false);
    });
    it("should successfully run a command that exists", () => {
        userMessage.content = config.PREFIX + " hello world";

        expect(handleCommand(bot, userMessage)).to.equal(true);
    });
});
