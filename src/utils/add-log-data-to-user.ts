import { User, UserModel } from "../models/User";
import got from "got";
import SteamID from "steamid";
import { LogData } from "../types";

async function saveToUser(data: LogData, id64: string): Promise<boolean> {
    return new Promise(resolve => {
        console.log("looking for user");
        User.findOne({
            steamID: id64
        }, (err, user: UserModel) => {
            if (err) {
                console.log(`Error retrieving user with Steam ID ${id64} from database.`);
                return resolve(false);
            }
    
            if (!user) {
                console.log(`User with Steam ID ${id64} does not exist in database.`);
                return resolve(false);
            }
    
            console.log("Found user with Steam ID " + id64);
    
            if (!user.logs) user.logs = [];
            else if (user.logs.find(log => log.id == data.id)) {
                console.log(`Log with id ${data.id} already exists in user with Steam ID ${id64} database entry.`);
                return resolve(false);
            }
    
            user.logs.push(data);
    
            user.save(err => {
                if (err) {
                    console.log(`Error saving user with Steam ID ${id64} to database.`);
                    return resolve(false);
                }
    
                console.log(`Appended log data to user with Steam ID ${id64} in database.`);
                return resolve(true);
            });
        });
    });
}

export async function exec(logsURL: string): Promise<void> {
    console.log("Starting task");

    let logIDMatch = logsURL.match(/\d+/) as RegExpMatchArray;

    let res = await got(logsURL.replace(/\/(\d+)/, "/json/$1"), { json: true });
    let data: LogData = res.body;
    data.id = logIDMatch[0];

    let promiseArray: Array<Promise<boolean>> = [];

    for (let id3 in data.players) {
        let steamID = new SteamID(id3);
        let id64 = steamID.getSteamID64();

        promiseArray.push(saveToUser(data, id64));
        console.log(`Added ${id64} to queue.`);
    }

    await Promise.all(promiseArray);
}