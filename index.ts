import dotenv from "dotenv";
import bot from "./src/bot";

dotenv.load();

bot.login();