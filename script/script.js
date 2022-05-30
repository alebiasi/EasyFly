/**
 * function used to load all the pending check-in requests
 */
function load_requests(){
    fetch("/api/v1/requests/pending?token="+window.localStorage.getItem("token"),{method:'GET'}).then((resp)=>resp.json()).then(function(data){ //get all requests from api
        var body= document.getElementById("table");
        if(data["requests"].length>1){  //create table only if there are requests to accept, otherwise give "No requests found!" message
            var table = document.createElement("table");
            table.className="table_auth";

            var tr_index= document.createElement("tr");
            tr_index.className="tr_auth";

            var td_requester_id_index=document.createElement("td");
            td_requester_id_index.textContent="Requester id";
            td_requester_id_index.className="td_auth";

            var td_document_id_index=document.createElement("td");
            td_document_id_index.textContent="Document id";
            td_document_id_index.className="td_auth";

            var td_booking_code_index=document.createElement("td");
            td_booking_code_index.textContent="Booking code";
            td_booking_code_index.className="td_auth";

            var td_n_cases_index=document.createElement("td");
            td_n_cases_index.textContent="Number of suitcases";
            td_n_cases_index.className="td_auth";

            var td_time_index=document.createElement("td");
            td_time_index.textContent="Request time";
            td_time_index.className="td_auth";

            var td_buttons_index=document.createElement("td");
            td_buttons_index.textContent="Buttons";
            td_buttons_index.className="td_auth";

            tr_index.appendChild(td_requester_id_index);
            tr_index.appendChild(td_document_id_index);
            tr_index.appendChild(td_booking_code_index);
            tr_index.appendChild(td_n_cases_index);
            tr_index.appendChild(td_time_index);
            tr_index.appendChild(td_buttons_index);

            table.appendChild(tr_index);

            body.appendChild(table);

            data["requests"].forEach(element => {
                if(Object.keys(element).length!==0){
                    var tr = document.createElement("tr");

                    //for each request create a row in the db showing all the fields

                    var td_requester_id=document.createElement("td");
                    td_requester_id.textContent=element.user_id;
                    td_requester_id.className="td_auth";

                    var td_document_id=document.createElement("td");
                    td_document_id.textContent=element.document_id;
                    td_document_id.className="td_auth";

                    var td_booking_code=document.createElement("td");
                    td_booking_code.textContent=element.booking_code;
                    td_booking_code.className="td_auth";

                    var td_n_cases=document.createElement("td");
                    td_n_cases.textContent=element.n_cases;
                    td_n_cases.className="td_auth";
                    
                    var td_time=document.createElement("td");
                    td_time.textContent=element.request_time;
                    td_time.className="td_auth";

                    var td_buttons=document.createElement("td");    //create buttons to accept or decline check-in request
                    td_buttons.className="td_auth";

                    var accept_request =document.createElement("button");
                    accept_request.type="button";
                    accept_request.textContent="Accept";
                    accept_request.className="button_main";
                    accept_request.onclick=()=>update_request(element._id,1, element.user_id,element.booking_code);
                    
                    var deny_request =document.createElement("button");
                    deny_request.type="button";
                    deny_request.textContent="Decline";
                    deny_request.className="button_main";
                    deny_request.onclick=()=>update_request(element._id,2,element.user_id,element.booking_code);
                    
                    td_buttons.appendChild(accept_request);
                    td_buttons.appendChild(deny_request);

                    tr.appendChild(td_requester_id);
                    tr.appendChild(td_document_id);
                    tr.appendChild(td_booking_code);
                    tr.appendChild(td_n_cases);
                    tr.appendChild(td_time);
                    tr.appendChild(td_buttons);

                    
                    table.appendChild(tr);
                }
            }); 
        }else{
            var no_request=document.createElement("h3");
            no_request.textContent="No requests found!";
            body.appendChild(no_request);
        }           
    })
    .catch(error => console.log(error));
};

/**
 * this function update the status of a check-in request and, if the request is accepted, create the boarding document and send it to the backend
 * @param  id id of the request
 * @param  value value to update the status of the request (0:pending, 1: accepted, 2:denied)
 * @param  user_id the id of the user that made the request
 * @param  flight_code id of the flight
 */
function update_request(id,value,user_id,flight_code){  //update the status of a specific request when the user click the accept or decline button
    const data = {status:value,token:window.localStorage.getItem("token")};

    fetch("/api/v1/requests/"+id,{method:"PUT",headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})
    .then(()=>{
        if(value==1){   //if the check-in request is accepted create the boarding card and send it to back-end
            fetch("/api/v1/authentication/users/"+user_id).then((resp)=>resp.json()).then(function(data){

                var doc = new jsPDF({orientation:"l"});
                doc.text(20,20,"Boarding Card");
                doc.text(20,40,"Name: "+data.name); //creation of a basic boarding card
                doc.text(150,40,"Surname: "+data.surname);
                doc.text(20,60,"Email: "+data.email);
                doc.text(150,60,"Flight: "+flight_code);
                doc.text(20,80,"");

                var blobPDF =  new Blob([ doc.output() ], { type : 'application/pdf'}); //convert pdf to blob to send it correctly to backend
                var fd = new FormData();
                fd.append("uid",user_id);   //append information for the backend
                fd.append("email",data.email);
                fd.append("document_type","2");
                fd.append("filetoupload",blobPDF,"boarding_card_"+user_id+".pdf");  //append file

                fetch("api/v1/save_documents",{method:"POST",body:fd}) //send file
                .then(location.reload());
            });
            
        }
    });   
};

/**
 * simple function for the arrow on top of the page
 */
function left_arrow_click(){
    location.href="/main_page"; //send back to main page
}

/**
 * function used to insert the user token inside a form so that it can be used in the backend when the form is sent
 */
function insert_token(){
    const urlParams = new URLSearchParams(window.location.search);
    var token =urlParams.get("token");
    if(token!=null)
        window.localStorage.setItem("token",token);
    var forms=document.getElementsByClassName("form");

    for(var i=0;i<forms.length;i=i+1){
        var hidden = document.createElement("input");
        hidden.type="hidden";
        hidden.name="token";
        hidden.value=window.localStorage.getItem("token");
        forms[i].appendChild(hidden);
    }
}
/**
 * function to change the login button in a logout button when the user is logged in and vice versa
 */
function refreshLoginLogout () {
    var form = document.getElementById("formLoginLogout");
    var btn = document.getElementById("btnLoginLogout");


    if(localStorage.getItem("token")) {
        form.action = "/api/v1/disconnect/logout";
        form.method = "POST";
        btn.value = "Logout";
        btn.addEventListener('click', () => {
            clearToken();
        })
    } else {
        form.action = "login.html";
        btn.value = "Accedi / Registrati";
        form.method = "GET";
    }
}


/**
 * function used to remove the token from local storage when the user logs out
 */
function clearToken(){
    localStorage.removeItem("token");

}
/**
 * function used to verify if the logged user is a standard or admin user and show the correct functionality based on that
 */
function verify_user_type(){
    //var token = localStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    var token = urlParams.get("token");
    var table = document.getElementById("table_main");
    if(token==null || token==""){
        token=window.localStorage.getItem("token");
    }
    if(token==null || token==""){    //standard non logged user
        //show standard main page
        create_standard_page();

    }else{
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        var parsedtoken=JSON.parse(atob(base64));
        var admin=parsedtoken["admin"];
        if(admin==true){ //admin user
            //show authorize checkin button
        
            var  tr1 = document.createElement("tr");    //creazione bottone autorizzazione check-in
            var td_auth_checkin = document.createElement("td");

            var form_auth_checkin =document.createElement("form");
            form_auth_checkin.method="POST";
            form_auth_checkin.action="/auth_checkin";
            form_auth_checkin.className="form";

            var button_auth_checkin = document.createElement("input");
            button_auth_checkin.type="submit";
            button_auth_checkin.name="submit_checkin";
            button_auth_checkin.className="button_main";
            button_auth_checkin.value="Autorizza check-in";

            form_auth_checkin.appendChild(button_auth_checkin);
            td_auth_checkin.appendChild(form_auth_checkin);
            tr1.appendChild(td_auth_checkin);
            table.appendChild(tr1);

            var  tr2 = document.createElement("tr");    //creazione bottone autorizzazione check-in
            var td_flights_update = document.createElement("td");

            var form_flights_update =document.createElement("form");
            form_flights_update.method="POST";
            form_flights_update.action="/flights_controller";
            form_flights_update.className="form";

            var button_flights_update = document.createElement("input");
            button_flights_update.type="submit";
            button_flights_update.name="submit_checkin";
            button_flights_update.className="button_main";
            button_flights_update.value="Verifica stato voli";

            form_flights_update.appendChild(button_flights_update);
            td_flights_update.appendChild(form_flights_update);
            tr2.appendChild(td_flights_update);
            table.appendChild(tr2);

            var  tr3 = document.createElement("tr");    //creazione bottone login /logout
            var td_login_logout = document.createElement("td");

            var form_login_logout =document.createElement("form");
            form_login_logout.method="GET";
            form_login_logout.action="/api/v1/disconnect/logout";
            form_login_logout.className="form";
            form_login_logout.id="formLoginLogout";

            var button_login_logout = document.createElement("input");
            button_login_logout.type="submit";
            button_login_logout.name="submit_login";
            button_login_logout.className="button_main";
            button_login_logout.value="Logout";
            button_login_logout.id="btnLoginLogout"

            form_login_logout.appendChild(button_login_logout);
            td_login_logout.appendChild(form_login_logout);
            tr3.appendChild(td_login_logout);
            table.appendChild(tr3);
        }else{  //standard logged user
            //show standard main page
            create_standard_page();
        }
    }
}
/**
 * function called in verify_user_type to create a standard page (non admin user)
 */
function create_standard_page(){
    var table = document.getElementById("table_main");
    var  tr1 = document.createElement("tr");    //creazione bottone check-in online
    var td_checkin = document.createElement("td");

    var form_checkin =document.createElement("form");
    form_checkin.method="POST";
    form_checkin.action="/checkin";
    form_checkin.className="form";

    var button_checkin = document.createElement("input");
    button_checkin.type="submit";
    button_checkin.name="submit_checkin";
    button_checkin.className="button_main";
    button_checkin.value="Effettua check-in";

    form_checkin.appendChild(button_checkin);
    td_checkin.appendChild(form_checkin);
    tr1.appendChild(td_checkin);
    table.appendChild(tr1);



    var  tr2 = document.createElement("tr");    //creazione bottone login /logout
    var td_login_logout = document.createElement("td");

    var form_login_logout =document.createElement("form");
    form_login_logout.method="GET";
    form_login_logout.action="/api/v1/disconnect/logout";
    form_login_logout.className="form";
    form_login_logout.id="formLoginLogout";

    var button_login_logout = document.createElement("input");
    button_login_logout.type="submit";
    button_login_logout.name="submit_login";
    button_login_logout.className="button_main";
    button_login_logout.value="Logout";
    button_login_logout.id="btnLoginLogout"

    form_login_logout.appendChild(button_login_logout);
    td_login_logout.appendChild(form_login_logout);
    tr2.appendChild(td_login_logout);
    table.appendChild(tr2);


    var  tr3 = document.createElement("tr");    //creazione bottone tabellone
    var td_tabellone = document.createElement("td");

    var form_tabellone =document.createElement("form");
    form_tabellone.method="GET";
    form_tabellone.action="/tabellone_orari.html";
    form_tabellone.className="form";

    var button_tabellone = document.createElement("input");
    button_tabellone.type="submit";
    button_tabellone.name="submit_tabellone";
    button_tabellone.className="button_main";
    button_tabellone.value="Visualizza voli";

    form_tabellone.appendChild(button_tabellone);
    td_tabellone.appendChild(form_tabellone);
    tr3.appendChild(td_tabellone);
    table.appendChild(tr3);


    var  tr4 = document.createElement("tr");    //creazione tabellone documenti
    var td_documenti = document.createElement("td");

    var form_documenti =document.createElement("form");
    form_documenti.method="GET";
    form_documenti.action="/documents_page.html";
    form_documenti.className="form";

    var button_documenti = document.createElement("input");
    button_documenti.type="submit";
    button_documenti.name="submit_documenti";
    button_documenti.className="button_main";
    button_documenti.value="I miei documenti";

    form_documenti.appendChild(button_documenti);
    td_documenti.appendChild(form_documenti);
    tr4.appendChild(td_documenti);
    table.appendChild(tr4);

    var  tr5 = document.createElement("tr");    //creazione tabellone documenti
    var td_airport_map = document.createElement("td");

    var form_airport_map =document.createElement("form");
    form_airport_map.method="GET";
    form_airport_map.action="/airport_map.html";
    form_airport_map.className="form";

    var btn_airport_map = document.createElement("input");
    btn_airport_map.type="submit";
    btn_airport_map.className="button_main";
    btn_airport_map.value="Mappa aeroporto";

    form_airport_map.appendChild(btn_airport_map);
    td_airport_map.appendChild(form_airport_map);
    tr5.appendChild(td_airport_map);
    table.appendChild(tr5);
}

/**
 * function to show error messages in the login page
 */
function checkerrors(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var error = urlParams.get("error");
    //document.getElementById("prova").innerText="ciaoaaaasdfsdgfdsgfdg";
    if(error=="user"){
        document.getElementById("error1").hidden=false;
    }
    if(error=="psw"){
        document.getElementById("error2").hidden=false;
    }
    if(error=="notLogged"){
        document.getElementById("error3").hidden=false;
    }
}

//controllo errori pagina registrazione
function checkerrorsReg(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var error = urlParams.get("error");
    //document.getElementById("prova").innerText="ciaoaaaasdfsdgfdsgfdg";
    if(error=="user"){
        document.getElementById("error1").hidden=false;
    }
    if(error=="incorrect"){
        document.getElementById("error2").hidden=false;
    }
}