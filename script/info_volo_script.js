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
                create_error_page("Attenzione, assicurati di aver acquisito la carta d'imbarco.");
            }
            //recupera e mostra tutti i dati sul volo
            else{
                //controllo se esista effettivamente nel db un volo associato alla carta d'imbarco
                if(data['error1']){
                    create_error_page("Attenzione: volo non trovato");
                }
                //mostro dati volo base
                else{
                    var main = document.getElementById('main');
                    var div = document.createElement('div');
                    div.innerHTML+= '<bold>Codice volo:<bold> '+data['cod']+'<br>'+'<bold>Compagnia aerea:<bold> '+data['company']+'<br>';
                    main.appendChild(div);
                    //se non sono stati ricevuti aggiornamenti sul volo
                    var div2 = document.createElement('div');
                    if(data['error2']){
                        div2.innerHTML="Al momento non ci sono aggiornamenti riguardanti il volo.";
                    }
                    else{
                        div2.innerHTML+= data['speed']+"<br>";
                        div2.innerHTML+= data['distance']+"<br>";
                        div2.innerHTML+= data['model']+"<br>";
                        div2.innerHTML+= data['type']+"<br>";
                        div2.innerHTML+= data['estimate_arrive']+"<br>";
                        div2.innerHTML+= data['start_location']+"<br>";
                        div2.innerHTML+= data['arrive_location']+"<br>";
                    }
                    main.appendChild(div2);

                }

                /*delay: info1.delay,
                gate: info1.gate,
                date: imbarco.date,
                time: imbarco.time,
                seat: imbarco.seat,
                entrance: imbarco.entrance,
                gate_close_time: imbarco.gate_close_time,
                landing_time: imbarco.landing_time,*/
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
        create_error_page("Sembra che ci sia un problema con le tue credenziali.");
    }
};

function create_error_page(errorMessage){
    var main = document.getElementById('main');
    var div = document.createElement('div');
    div.className="errorClass";
    div.innerHTML=errorMessage;

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
};