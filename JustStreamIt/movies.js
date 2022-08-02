const mainUrl = "http://localhost:8000/api/v1/titles/"

BestMovie()

// Best movie

function BestMovie() {

    let bestTitle = document.getElementById('top-title');
    let bestImg = document.getElementsByClassName('best-cover')[0].getElementsByTagName("img")[0];
    let bestDesc = document.getElementsByClassName('best-desc')[0];
    let bestButton = document.getElementsByClassName('button')[1];

    fetch(mainUrl + "?sort_by=-imdb_score")
        .then(response => response.json())
        .then(data => {
            bestTitle.innerHTML = data["results"][0]["title"];
            bestImg.src = data["results"][0]["image_url"];
            bestButton.setAttribute("onclick", `openModal("${data["results"][0]["id"]}")`)
            fetch(data["results"][0]["url"])
                .then(response => response.json())
                .then(data => {
                    bestDesc.innerHTML = data["description"];
                })
        })

}


// Modal control and fetch data

function openModal(id) {

    let modal = document.getElementById("modal");
    let span = document.getElementsByClassName("close")[0];

    ModalData(id)

    modal.style.display = "block";

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal)
            modal.style.display = "none";
    }
}

function ModalData(id) {

    fetch(mainUrl + id)
        .then(response => response.json())
        .then(data => {

            document.getElementById('modal-cover').src = data["image_url"];
            document.getElementById('modal-title').innerHTML = data["title"];

            document.getElementById('modal-year').innerHTML = data["year"];
            document.getElementById('modal-duration').innerHTML = data["duration"] + " min";
            document.getElementById('modal-genres').innerHTML = data["genres"];
            document.getElementById('modal-imdb').innerHTML = data["imdb_score"] + " / 10";

            document.getElementById('modal-directors').innerHTML = data["directors"];
            document.getElementById('modal-cast').innerHTML = data["actors"];
            document.getElementById('modal-country').innerHTML = data["countries"];


            if (typeof data["rated"] === 'string' || data["rated"] instanceof String)
                document.getElementById('modal-rating').innerHTML = "Tous publics";
            else
                document.getElementById('modal-rating').innerHTML = data["rated"] + "+";

            let modalBoxOffice = document.getElementById('modal-box-office');
            if (data["worldwide_gross_income"] == null)
                modalBoxOffice.innerHTML = "N/A";
            else
                modalBoxOffice.innerHTML = data["worldwide_gross_income"] + " " + "entrées mondiales";

            let regExp = /[a-zA-Z]/g;
            if (regExp.test(data["long_description"]))
                document.getElementById('modal-desc').innerHTML = data["long_description"];
            else
                document.getElementById('modal-desc').innerHTML = "N/A";

        })
}
