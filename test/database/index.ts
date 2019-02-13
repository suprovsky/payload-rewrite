import { describe, it } from "mocha";
import { expect } from "chai";
import database from "../../src/database";

describe("Database", () => {
    it("should initialize without any errors", () => {
        expect(database).to.not.throw;
    });
});