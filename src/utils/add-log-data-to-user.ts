import { User, UserModel } from "../models/User";
import got from "got";
import SteamID from "SteamID";
import { LogData } from "../types";

(async () => {
    console.log("Starting task", process.env);

    if (!process.env.LOGS) return console.log("Missing LOGS env variable for child!");

    let logIDMatch = process.env.LOGS.match(/\d+/) as RegExpMatchArray;

    let logsURL = process.env.LOGS as string;

    try {
        let res = await got(logsURL.replace(/\/(\d+)/, "/json/$1"), { json: true });
        let data: LogData = res.body;
        data.id = logIDMatch[0];

        for (let id3 in data.players) {
            let steamID = new SteamID(id3);
            let id64 = steamID.getSteamID64();

            User.findOne({
                steamID: id64
            }, (err, user: UserModel) => {
                if (err) return console.log(`Error retrieving user with Steam ID ${id64} from database.`);

                if (!user) return console.log(`User with Steam ID ${id64} does not exist in database.`);

                if (!user.logs) user.logs = [];
                else if (user.logs.find(log => log.id == data.id)) return console.log(`Log with id ${data.id} already exists in user with Steam ID ${id64} database entry.`);

                user.logs.push(data);

                user.save(err => {
                    if (err) return console.log(`Error saving user with Steam ID ${id64} to database.`);

                    console.log(`Appended log data to user with Steam ID ${id64} in database.`);
                });
            });
        }
    } catch (err) {
        console.log("Unknown error thrown!", err);
    }
})();