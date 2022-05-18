/**
 * This function refresh the user boarding_card
 */
function loadBoardingCard(userId) {

    const tableDocuments = document.getElementById('table_documents'); // Get the list where we will place the documents

    tableDocuments.innerHTML = '';
    
    fetch('../api/v1/boarding_cards/' + userId)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        
        // console.log(data);
        
        return data.map(function(boardingCard) { // Map through the results and for each run the code below
            
            tableDocuments.innerHTML += `<tr><td>Nome</td><td>${boardingCard.name}</td></tr>`;
            tableDocuments.innerHTML += `<tr><td>Cognome</td><td>${boardingCard.surname}</td></tr>`;
            tableDocuments.innerHTML += `<tr><td>Codice volo</td><td>${boardingCard.flight_code}</td></tr>`;
            tableDocuments.innerHTML += `<tr><td>Data</td><td>${boardingCard.date}</td></tr>`;
            tableDocuments.innerHTML += `<tr><td>Ora</td><td>${boardingCard.time}</td></tr>`;
            tableDocuments.innerHTML += `<tr><td>Posto</td><td>${boardingCard.seat}</td></tr>`;
            tableDocuments.innerHTML += `<tr><td>Entrata</td><td>${boardingCard.entrance}</td></tr>`;
            tableDocuments.innerHTML += `<tr><td>Chiusura gate</td><td>${boardingCard.gate_close_time}</td></tr>`;
            tableDocuments.innerHTML += `<tr><td>Ora atterraggio</td><td>${boardingCard.landing_time}</td></tr>`;

        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}

function loadDocuments(userId) {

    const idImg = document.getElementById('id_img'); // Get the img where place the id image
    const passportImg = document.getElementById('passport_img'); // Get the img where place the passport image

    idImg.src = './imgs/none.png';
    passportImg.src = './imgs/none.png';
    
    fetch('../api/v1/documents/' + userId)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
        
        // console.log(data);
        
        return data.map(function(document) { // Map through the results and for each run the code below
            
            if (document.type == 0) {
                idImg.src = document.image_url;
            } else {
                passportImg.src = document.image_url;
            }

        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
}

loadBoardingCard("user_123");
loadDocuments("user_123");