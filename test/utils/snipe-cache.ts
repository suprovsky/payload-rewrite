import { describe, it } from "mocha";
import { expect } from "chai";
import { handleMessageDelete, cleanCache } from "../../src/utils/snipe-cache";
import { Collection } from "discord.js";

describe("snipeCache", () => {
    describe("#handleMessageDelete()", () => {
        it("should not cache if the author is a bot", () => {
            let bot = {
                cache: {
                    snipe: {
                        "1": {
                            "1": new Collection()
                        }
                    }
                }
            };
            let message = {
                id: "1",
                author: {
                    bot: true
                },
                guild: {
                    id: "1"
                },
                channel: {
                    id: "1"
                }
            };
    
            //@ts-ignore
            handleMessageDelete(bot, message);
    
            expect(bot.cache.snipe["1"]["1"].size).to.equal(0);
        });
        it("should cache if the author isn't a bot", () => {
            let bot = {
                cache: {
                    snipe: {
                        "1": {
                            "1": new Collection()
                        }
                    }
                }
            };
            let message = {
                id: "1",
                author: {
                    bot: false
                },
                guild: {
                    id: "1"
                },
                channel: {
                    id: "1"
                }
            };
    
            //@ts-ignore
            handleMessageDelete(bot, message);
    
            expect(bot.cache.snipe["1"]["1"].size).to.equal(1);
        });
        it("should automatically create guild and channel properties if they don't already exist", () => {
            let bot = {
                cache: {
                    snipe: {}
                }
            };
            let message = {
                id: "1",
                author: {
                    bot: false
                },
                guild: {
                    id: "1"
                },
                channel: {
                    id: "1"
                }
            };
    
            //@ts-ignore
            handleMessageDelete(bot, message);
    
            //@ts-ignore
            expect(bot.cache.snipe["1"], "Guild property was not created!").to.exist;
            //@ts-ignore
            expect(bot.cache.snipe["1"]["1"], "Channel property was not created!").to.exist;
            //@ts-ignore
            expect(bot.cache.snipe["1"]["1"].size, "Message was never added to cache!").to.equal(1);
        });
    });

    describe("#cleanCache()", () => {
        it("should delete cached messages over 5 minutes old", () => {
            let bot = {
                cache: {
                    snipe: {
                        "1": {
                            "1": new Collection()
                        }
                    }
                }
            };
            let message = {
                id: "1",
                author: {
                    bot: false
                },
                guild: {
                    id: "1"
                },
                channel: {
                    id: "1"
                },
                createdAt: new Date(Date.now() - (1000 * 60 * 5 + 1))
            };
            bot.cache.snipe["1"]["1"].set("1", message);
    
            //@ts-ignore
            cleanCache(bot, message);
    
            expect(bot.cache.snipe["1"]["1"].size).to.equal(0);
        });
    });
});