function getToken() {
    var token = localStorage.getItem('token');
    if(token != null && token != "") {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        parsedtoken=JSON.parse(atob(base64));
    }
    return token != "" && token != null ? parsedtoken["id"] : "-1";
}

function checkLogged(token) {
    if(token == -1) {
        var body = document.getElementById("container");
        body.innerHTML = "<br><br><br><br><br><br><h1 style='text-align: center;'>Devi prima eseguire l'accesso</h1>";
    }
    else {
        loadInformation(token);
    }
}

function loadInformation(userId) {

    fetch('../api/v1/acc_information/' + userId, {
        method: 'GET',
    })
    .then( resp => resp.json())
    .then( data => {

        // console.log(data);

        return data.map( optInformation => {
            if(optInformation.pathology != "") {
                const pathol = optInformation.pathology;
                pathol.split(';').forEach( p => {
                    document.getElementById(p).checked = true;
                });
            }
            if(optInformation.allergies != "") {
                document.getElementById('allergies').value = optInformation.allergies;
            }
            document.getElementById('vaccine').value = optInformation.covid_vaccine;
            if(optInformation.more_info != "") {
                document.getElementById('moreInfo').value = optInformation.more_info;
            }
        });
    })
    .catch(err => console.log(err));
}

checkLogged(getToken());

function giveUid() {
    let saveData = document.getElementById('uid_0');

    saveData.value = getToken();
    console.log(saveData.value);
}

function deleteAllSelection() {
    document.getElementById('artrite').checked = false;
    document.getElementById('asma').checked = false;
    document.getElementById('artrosi').checked = false;
    document.getElementById('diabete').checked = false;
    document.getElementById('distrofia').checked = false;
    document.getElementById('epilessia').checked = false;
    document.getElementById('insufficienza').checked = false;
    document.getElementById('ipertensione').checked = false;
    document.getElementById('ipotiroidismo').checked = false;
    document.getElementById('parkinson').checked = false;

    document.getElementById('allergies').value = '';
    document.getElementById('vaccine').value = 0;
    document.getElementById('moreInfo').value = '';
}