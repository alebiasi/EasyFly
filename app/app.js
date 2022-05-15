const app = express();
const checkin = require("./checkin.js");

app.use(express.json());
app.use(express.urlencoded({extended: true}));


//inserire index.html (form di login/registrazione) + ogni contenuto visibile senza login

//inserire middleware autenticazione

app.use("/api/v1/requests",checkin);

//inserire pagina not found

module.exports = app;