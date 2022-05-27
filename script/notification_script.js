/**
 * This function refresh the list of flights
 */
 function loadFlights() {
    const ul = document.getElementById('flights'); // Get the list where we will place our authors

    ul.innerHTML = '';

    fetch('../api/v1/flights')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please

        // console.log(data);
        
        return data.map(function(flight) { // Map through the results and for each run the code below
            

            // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);
            /*
            let li = document.createElement('li');
            let span = document.createElement('span');
            span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
            span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
            
            // Append all our elements
            li.appendChild(span);
            ul.appendChild(li);
            */

            let li = document.createElement('li');
            let table = document.createElement('table')

            li.className = "flightBox";

            let tr = document.createElement('tr');
            tr.innerHTML += `<td><img src="imgs/clock.png" class="flightIcon"/>${flight.hour}</td>`;
            tr.innerHTML += `<td><img src="imgs/aeroplane.png" class="flightIcon"/>${flight.company}</td>`;
            table.appendChild(tr);
            
            tr = document.createElement('tr');
            tr.innerHTML += `<td></td>`;
            let delayFormatted = flight.delay == 0 ? "In orario" :  flight.delay < 0 ? "Cancellato" : "Ritardo " + flight.delay + " minuti";
            let hourClass = flight.delay == 0 ? "green" :  flight.delay < 0 ? "black" : "red";
            tr.innerHTML += `<td class="${hourClass}"><img src="imgs/comment.png" class="flightIcon"/>${delayFormatted}</td>`;
            table.appendChild(tr);

            tr = document.createElement('tr');
            //tr.innerHTML += `<td><img src="imgs/list.png" class="flightIcon"/><a href="${flight.self}">${flight.cod}</a></td>`;
            tr.innerHTML += `<td><img src="imgs/list.png" class="flightIcon"/>${flight.cod}</td>`;
            let gateFormatted = flight.gate != undefined ? "Gate <strong style='color:#395577'>" + flight.gate + "</strong>" : "Gate -";
            tr.innerHTML += `<td><img src="imgs/walker.png" class="flightIcon"/>${gateFormatted}</td>`;
            table.appendChild(tr);

            tr = document.createElement("tr");
            var td= document.createElement("td");
            var form = document.createElement("form");
            form.method="POST";
            form.action="/report_delay";
            var button = document.createElement("input");
            //button.onclick=send_report(window.localStorage.getItem("token"),flight.cod);
            button.type="submit";
            button.name="button_report_delay";
            button.value="Segnala ritardo"
            button.className="button_main";

            var token = document.createElement("input");
            token.type="hidden";
            token.name="token";
            token.value=window.localStorage.getItem("token");

            window.localStorage.setItem("flight_code",flight.cod+"");


            form.appendChild(token);
            form.appendChild(button);
            form.appendChild(button);
            td.appendChild(form);
            tr.appendChild(td);
            table.appendChild(tr);

            li.appendChild(table);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}

function insert_flight(){
    var myform = document.getElementById("form");
    var mybutton = document.createElement("button");
    mybutton.name="invia";
    mybutton.value="Invia";
    mybutton.textContent="Invia";
    mybutton.setAttribute("onclick","send_report();");
    var delay_minutes = document.createElement("input");
    delay_minutes.type="number";
    delay_minutes.id="delay_minutes";
    delay_minutes.required=true;
    delay_minutes.placeholder="Minuti di ritardo";

    myform.appendChild(delay_minutes);
    myform.appendChild(mybutton);
}

function send_report(){
    var data = {token:window.localStorage.getItem("token"),delay:document.getElementById("delay_minutes").value};
    fetch("/api/v2/flights/"+window.localStorage.getItem("flight_code"),{method:"PUT",headers: {'Content-Type': 'application/json',},body: JSON.stringify(data)})
    .then(window.localStorage.removeItem("flight_code")).then( window.location.href="/flights_controller?token="+window.localStorage.getItem("token"));
}