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
                    div.className="infoClass";
                    div.innerHTML+= '<b>Codice volo:</b>&nbsp;'+data['cod']+'<br>'+'<b>Compagnia aerea:</b>&nbsp;'+data['company']+'<br>';
                    main.appendChild(div);
                    //se non sono stati ricevuti aggiornamenti sul volo
                    var div2 = document.createElement('div');
                    div2.className="infoClass";
                    if(data['error2']){
                        div2.innerHTML="Al momento non ci sono aggiornamenti riguardanti il volo.";
                    }
                    else{
                        div2.innerHTML+= "<b>Partenza:</b>"+data['start_location']+"&nbsp;&nbsp;&nbsp;&nbsp<b>Arrivo:</b>"+data['arrive_location']+"<br>";
                        div2.innerHTML+= "<b>Velocit&#225;:</b>&nbsp"+data['speed']+"km/h<br>";
                        div2.innerHTML+= "<b>Distanza:</b>&nbsp"+data['distance']+"km<br>";
                        div2.innerHTML+= "<b>Modello di aereo:</b>&nbsp"+data['model']+"<br>";
                        div2.innerHTML+= "<b>Orario di arrivo previsto:</b>&nbsp"+data['estimate_arrive']+"<br>";
                    }
                    main.innerHTML+="<br>";
                    var mapDiv = document.createElement('div');
                    mapDiv.className="map";
                    mapDiv.id="map";
                    main.appendChild(mapDiv);
                    main.innerHTML+="<br>";
                    main.appendChild(div2);
                    //creazione mappa
                    createMap(data['start_long'],data['start_lat'],data['arrive_long'],data['arrive_lat']);

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

//funzione per creazione mappa
function createMap(long_from, lat_from, long_to, lat_to){
    //centramento mappa
    long_center=(long_from+long_to)/2;
    lat_center=(lat_from+lat_to)/2;
    //creazione mappa con openLayer centrata 
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
            source: new ol.source.OSM()
        })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([long_center, lat_center]),
            zoom: 5
        })
    });
    //creazione puntatori a partenza e arrivo
    var layerFrom = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([long_from, lat_from]))
                })
            ]
        })
    });

    var layerTo = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([long_to, lat_to]))
                })
            ]
        })
    });

    //creazione linea di collegamento
    var points = [ [long_from, lat_from], [long_to, lat_to] ];

    for (var i = 0; i < points.length; i++) {
        points[i] = ol.proj.transform(points[i], 'EPSG:4326', 'EPSG:3857');
    }

    var featureLine = new ol.Feature({
        geometry: new ol.geom.LineString(points)
    });

    var vectorLine = new ol.source.Vector({});
    vectorLine.addFeature(featureLine);

    var vectorLineLayer = new ol.layer.Vector({
        source: vectorLine,
        style: new ol.style.Style({
            fill: new ol.style.Fill({ color: '#2d3bba', weight: 4 }),
            stroke: new ol.style.Stroke({ color: '#2d3bba', width: 2 })
        })
    });

    //aggiunta elementi alla mappa
    map.addLayer(vectorLineLayer);
    map.addLayer(layerFrom);
    map.addLayer(layerTo);

}

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