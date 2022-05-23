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
                    accept_request.onclick=()=>update_request(element._id,1);
                    
                    var deny_request =document.createElement("button");
                    deny_request.type="button";
                    deny_request.textContent="Decline";
                    deny_request.className="button_main";
                    deny_request.onclick=()=>update_request(element._id,2);
                    
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
function update_request(id,value){  //update the status of a specific request when the user click the accept or decline button
    const data = {status:value,token:window.localStorage.getItem("token")};
    /*if(id==1){
        var doc = new jsPDF();
        doc.text(10,10,"Test pdf creation");
    }*/
    fetch("/api/v1/requests/"+id,{method:"PUT",headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})
    //.then(fetch("api/v1/save_documents",{method:"POST",headers: {'Content-Type': 'application/pdf',},body:JSON.stringify({filetoupload:doc})})) //todo verify if this works
    .then(location.reload());
    
};

function left_arrow_click(){
    location.href="/main_page"; //send back to main page
}

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

function refreshLoginLogout () {
    var form = document.getElementById("formLoginLogout");
    var btn = document.getElementById("btnLoginLogout");

    console.log(form, btn);

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



function clearToken(){
    localStorage.clear();

}

function verify_user_type(){
    const urlParams = new URLSearchParams(window.location.search);
    var token = urlParams.get("token");
    var table = document.getElementById("table_main");
    if(token==null){
        token=window.localStorage.getItem("token");
    }
    if(token==null){    //standard non logged user
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
        }else{  //standard logged user
            //show standard main page
            create_standard_page();
        }
    }
}

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
}