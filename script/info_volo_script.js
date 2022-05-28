function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

function verifyHowtoLoad(){
    //token --> id utente --> chiamo api
    var token = localStorage.getItem("token");
    if(token) {
        var id_utente= parseJwt(token)["id"];
        /*var main = document.getElementById('main');
        var div = document.createElement('div');
        main.appendChild(div);*/
        fetch('../api/v1/flightInfo/' + id_utente) 
        //fetch('../api/v1/flightInfo')
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify as you please
            // console.log(data)
            //se non possiedi alcuna carta d'imbarco
            var error = data['error'];
            if(error){
                var main = document.getElementById('main');
                var div = document.createElement('div');
                div.className="errorClass";
                div.innerHTML="Attenzione, assicurati di aver acquisito la carta d'imbarco.";
        
                //bottone e form per tornare alla home page.
                var form_home =document.createElement("form");
                form_home.method="POST";
                form_home.action="/main_page";
                form_home.className="form";
                var btn_home = document.createElement("input");
                btn_home.type="submit";
                btn_home.className="button_main";
                btn_home.value="Vai alla pagina principale";
                form_home.appendChild(btn_home);
        
                //bottone e form per tornare alla pagina login
                var form_login =document.createElement("form");
                form_login.method="POST";
                form_login.action="/login";
                form_login.className="form";
                var btn_login = document.createElement("input");
                btn_login.type="submit";
                btn_login.className="button_main";
                btn_login.value="Vai alla pagina di login/registrazione";
                form_login.appendChild(btn_login);
        
                main.appendChild(div);
                main.appendChild(form_home);
                main.appendChild(form_login);
            }
            //recupera e mostra tutti i dati sul volo
            else{
                var main = document.getElementById('main');
                var div = document.createElement('div');
                div.innerHTML= data['id'];
                main.appendChild(div);
            }
                /*tableDocuments.innerHTML += `<tr><td>Nome</td><td>${boardingCard.name}</td></tr>`;
                tableDocuments.innerHTML += `<tr><td>Cognome</td><td>${boardingCard.surname}</td></tr>`;
                tableDocuments.innerHTML += `<tr><td>Codice volo</td><td>${boardingCard.flight_code}</td></tr>`;
                tableDocuments.innerHTML += `<tr><td>Data</td><td>${boardingCard.date}</td></tr>`;
                tableDocuments.innerHTML += `<tr><td>Ora</td><td>${boardingCard.time}</td></tr>`;
                tableDocuments.innerHTML += `<tr><td>Posto</td><td>${boardingCard.seat}</td></tr>`;
                tableDocuments.innerHTML += `<tr><td>Entrata</td><td>${boardingCard.entrance}</td></tr>`;
                tableDocuments.innerHTML += `<tr><td>Chiusura gate</td><td>${boardingCard.gate_close_time}</td></tr>`;
                tableDocuments.innerHTML += `<tr><td>Ora atterraggio</td><td>${boardingCard.landing_time}</td></tr>`;*/
    
            //})
        })
        .catch( error => console.error(error) );// If there is any error you will catch them here*/
    } else {
        var main = document.getElementById('main');
        var div = document.createElement('div');
        div.className="errorClass";
        div.innerHTML="Sembra che ci sia un problema con le tue credenziali.";

        //bottone e form per tornare alla home page.
        var form_home =document.createElement("form");
        form_home.method="POST";
        form_home.action="/main_page";
        form_home.className="form";
        var btn_home = document.createElement("input");
        btn_home.type="submit";
        btn_home.className="button_main";
        btn_home.value="Vai alla pagina principale";
        form_home.appendChild(btn_home);

        //bottone e form per tornare alla pagina login
        var form_login =document.createElement("form");
        form_login.method="POST";
        form_login.action="/login";
        form_login.className="form";
        var btn_login = document.createElement("input");
        btn_login.type="submit";
        btn_login.className="button_main";
        btn_login.value="Vai alla pagina di login/registrazione";
        form_login.appendChild(btn_login);

        main.appendChild(div);
        main.appendChild(form_home);
        main.appendChild(form_login);

    }
};