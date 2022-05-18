function load_requests(){
    fetch("/api/v1/requests/pending",{method:'GET'}).then((resp)=>resp.json()).then(function(data){ //get all requests from api
        var table = document.getElementById("checkin_list");
        data["requests"].forEach(element => {
            if(Object.keys(element).length!==0){
                console.log(element._id);
                var tr = document.createElement("tr");

                //for each request create a row in the db showing all the fields

                var td_requester_id=document.createElement("td");
                td_requester_id.textContent=element.user_id;

                var td_document_id=document.createElement("td");
                td_document_id.textContent=element.document_id;

                var td_booking_code=document.createElement("td");
                td_booking_code.textContent=element.booking_code;

                var td_n_cases=document.createElement("td");
                td_n_cases.textContent=element.n_cases;

                var td_time=document.createElement("td");
                td_time.textContent=element.request_time;
                
                var td_buttons=document.createElement("td");    //create buttons to accept or decline check-in request
        
                var accept_request =document.createElement("button");
                accept_request.type="button";
                accept_request.textContent="Accept";
                accept_request.onclick=()=>update_request(element._id,1);
                
                var deny_request =document.createElement("button");
                deny_request.type="button";
                deny_request.textContent="Decline";
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
    })
    .catch(error => console.log(error));
};
function update_request(id,value){
    console.log("to be implemented");

};