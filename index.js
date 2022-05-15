const app = require("./app/app.js");
const mongoose = require("mongoose");
const port = process.env.port || 8080;
//avviare connessione db, poi
app.listen(port, ()=>{
    console.log("Server started on port ",port);
});