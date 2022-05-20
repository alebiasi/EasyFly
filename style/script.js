function load_requests(){
    fetch("/api/v1/requests/pending",{method:'GET'}).then((resp)=>resp.json()).then(function(data){ //get all requests from api
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
    const data = {status:value};
    fetch("/api/v1/requests/"+id,{method:"PUT",headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)}).then(location.reload());
};

function left_arrow_click(){
    location.href="/main_page"; //send back to main page
}