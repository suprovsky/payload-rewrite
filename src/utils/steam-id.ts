import SteamID from "steamid";
import got from "got";

export async function ensureSteamID(id: string): Promise<string | undefined> {
    let steamID: SteamID;

    if (id.length == 0) return undefined;

    try {
        steamID = new SteamID(id);
    } catch (err) {
        try {
            let steamPage = await got("https://steamcommunity.com/id/" + id);
            let body = steamPage.body;

            let cssSteamID = body.match(/<div class="commentthread_area" id="commentthread_Profile_\d+_area">/);

            if (!cssSteamID) return undefined;

            return (cssSteamID[0].match(/\d+/) as RegExpMatchArray)[0];
        } catch (err) {
            return undefined;
        }
    }

    return steamID.getSteamID64();
}