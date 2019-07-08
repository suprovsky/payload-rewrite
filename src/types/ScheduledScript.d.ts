import { Bot } from "./Bot";

export interface ScheduledScript {
    every: number;
    run: (bot: Bot) => Promise<void>;
}