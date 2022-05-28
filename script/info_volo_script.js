function verifyHowtoLoad(){
    //token --> id utente --> chiamo api
    if(localStorage.getItem("token")) {
        var main = document.getElementById('main');
        var div = document.createElement('div');
        div.innerHTML="Bella fra."
        main.appendChild(div);
        /*form.action = "/api/v1/disconnect/logout";
        form.method = "POST";
        btn.value = "Logout";
        btn.addEventListener('click', () => {
            clearToken();
        })*/
    } else {
        var main = document.getElementById('main');
        var div = document.createElement('div');
        div.className="errorClass";
        div.innerHTML="Sembra che ci sia un problema con le tue credenziali.";

        //bottone e form per tornare alla home page.
        var form_home =document.createElement("form");
        form_home.method="POST";
        form_home.action="/login";
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

    }
};