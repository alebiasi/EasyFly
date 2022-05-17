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

            let tr = document.createElement('tr');
            tr.innerHTML += `<td>"${flight.hour}"</td>`;
            tr.innerHTML += `<td>"${flight.company}"</td>`;
            table.appendChild(tr);
            
            tr = document.createElement('tr');
            tr.innerHTML += `<td></td>`;
            tr.innerHTML += `<td>"${flight.delay}"</td>`;
            table.appendChild(tr);

            tr = document.createElement('tr');
            tr.innerHTML += `<td>"${flight.cod}"</td>`;
            tr.innerHTML += `<td>"${flight.gate}"</td>`;
            table.appendChild(tr);

            li.appendChild(table);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}
loadFlights();