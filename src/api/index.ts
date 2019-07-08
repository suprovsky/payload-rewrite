import express from "express";
import { Bot } from "../types";

export async function listen(port: number, bot: Bot): Promise<void> {
    const server = express();

    server.get("/commands", (req, res) => {
        res.json({
            count: bot.commands.filter(command => !command.requiresRoot).size,
            data: bot.commands.filter(command => !command.requiresRoot).array()
        });
    });

    server.get("/autoresponses", (req, res) => {
        res.json({
            count: bot.autoResponses.size,
            data: bot.autoResponses.array()
        });
    });

    server.get("/stats", (req, res) => {
        res.json({
            users: bot.users.size,
            servers: bot.guilds.size,
            uptime: bot.uptime
        });
    });

    server.get("/all-data", (req, res) => {
        res.json({
            commands: {
                count: bot.commands.filter(command => !command.requiresRoot).size,
                data: bot.commands.filter(command => !command.requiresRoot).array()
            },
            autoResponses: {
                count: bot.autoResponses.size,
                data: bot.autoResponses.array()
            },
            stats: {
                users: bot.users.size,
                servers: bot.guilds.size,
                uptime: bot.uptime
            }
        });
    });

    return new Promise(resolve => {
        server.listen(port, resolve);
    });
}