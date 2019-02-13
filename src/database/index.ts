import Enmap from "enmap";

const db = new Enmap({
    name: "servers",
    fetchAll: false,
    autoFetch: false,
    polling: true
});

export default db;