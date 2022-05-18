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

            li.appendChild(table);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}
loadFlights();