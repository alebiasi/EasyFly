const app = require("./app/app.js");
const mongoose = require("mongoose");
const port = process.env.port || 8080;
//avviare connessione db, poi
const psw ="testdatabase"
const db_name="requests"
const db_url="mongodb+srv://testdatabase:"+psw+"@cluster.uzlqw.mongodb.net/"+db_name+"?retryWrites=true&w=majority"
app.locals.db = mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {   
    console.log("Connected to Database");
    app.listen(port, () => {
        console.log('Server listening on port ',port);
    });
    
});

/*app.listen(port, ()=>{
    console.log("Server started on port ",port);
});*/