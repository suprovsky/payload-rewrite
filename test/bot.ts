import { describe, it } from "mocha";
import { expect } from "chai";
import bot from "../src/bot";
import cfg from "../secure-config";

describe("Payload", () => {
    it("should have a working db object", () => {
        expect(bot.db).to.exist;
    });
});