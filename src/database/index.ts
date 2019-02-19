import Enmap from "enmap";
import mongoose from "mongoose";

const db = new Enmap({
    name: "servers",
    fetchAll: false,
    autoFetch: false,
    polling: true
});

export default db;