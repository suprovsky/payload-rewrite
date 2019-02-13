import { describe, it } from "mocha";
import { capture, captureSelector } from "../../src/utils/screenshot";

describe("screenshot", () => {
    describe("#capture()", () => {
        it("should be able to take full page screenshots", done => {
            capture("https://google.com").then(buffer => done()).catch(done);
        }).timeout(30000);
        it("should be able to take a screenshot of a region", done => {
            capture("https://google.com", {top: 100, left: 100, bottom: 300, right: 300}).then(buffer => done()).catch(done);
        }).timeout(30000);
        it("should be able to take a screenshot of a region based off of elements", done => {
            capture("https://google.com", {
                top: {
                    selector: "#hplogo",
                    edge: "top"
                },
                left: {
                    selector: "#tsf > div:nth-child(2) > div",
                    edge: "left"
                },
                bottom: {
                    selector: "#tsf > div:nth-child(2) > div > div.FPdoLc.VlcLAe > center > input[type=\"submit\"]:nth-child(1)",
                    edge: "bottom"
                },
                right: {
                    selector: "#tsf > div:nth-child(2) > div",
                    edge: "right"
                }
            }).then(buffer => done()).catch(done);
        }).timeout(30000);
    });
    describe("#captureSelector()", () => {
        it("should be able to capture a screenshot of an element", done => {
            captureSelector("https://google.com", "#hplogo").then(buffer => done()).catch(done);
        }).timeout(30000);
    });
});