const mainUrl = "http://localhost:8000/api/v1/titles/";

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
            //image control
            checkImg()
            function checkImg(){
	            let tester=new Image()
	            tester.onload=function() {document.getElementById('modal-cover').src = data["image_url"];}
	            tester.onerror=function() {document.getElementById('modal-cover').src =
	            "./JustStreamIt/images/default_cover.jpg"}
	            tester.src = data["image_url"];
            }
            //document.getElementById('modal-cover').src = data["image_url"];
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
                modalBoxOffice.innerHTML = data["worldwide_gross_income"] + " " + "entr??es mondiales";

            let regExp = /[a-zA-Z]/g;
            if (regExp.test(data["long_description"]))
                document.getElementById('modal-desc').innerHTML = data["long_description"];
            else
                document.getElementById('modal-desc').innerHTML = "N/A";

        })
}
// Categories best and Sci-Fi

async function CategoriesBestandSciencefiction(name, skip, total = 7) {
        let results = await fetch(mainUrl + "?sort_by=-imdb_score&genre=" + name);


   if (!results.ok)
        return
        const data = await results.json();
        let moviesData = Array(...data.results);
   if (skip > 0)
    moviesData.splice(0, skip);

   if (moviesData.length < total) {
        let results2 = await (await fetch(data.next)).json();
        moviesData.push(...Array(...results2.results).slice(0, total - moviesData.length));
   }

        return moviesData;
   }

// Category western

async function Category2(name, skip, total = 7) {

        let results = await fetch(mainUrl + "?sort_by=-imdb_score&country=Italy&genre=" + name);

   if (!results.ok)
        return
        const data = await results.json();
        let moviesData = Array(...data.results);

   if (skip > 0)
        moviesData.splice(0, skip);

   if (moviesData.length < total) {
        let results2 = await (await fetch(data.next)).json();
        moviesData.push(...Array(...results2.results).slice(0, total - moviesData.length));
   }

        return moviesData
   }
// Category Louis de Fun??s

async function Category3(name, skip, total = 7) {

        let results = await fetch(mainUrl + "?sort_by=-imdb_score&actor=Louis de Fun??s&genre=" + name);
   if (!results.ok)
        return
        const data = await results.json();
        let moviesData = Array(...data.results);
   if (skip > 0)
        moviesData.splice(0, skip);

   if (moviesData.length < total) {
        let results2 = await (await fetch(data.next)).json();
        moviesData.push(...Array(...results2.results).slice(0, total - moviesData.length));
   }

        return moviesData;
   }
// Carousel controls

function moveCarouselLeft(category) {

    let carrouselContent = document.querySelector("#" + category + "-movies");
    let carrouselLeftBtn = document.querySelector("#" + category + "-left");
    let carrouselRightBtn = document.querySelector("#" + category + "-right");

    carrouselContent.style.left = "-680px";
    carrouselRightBtn.classList.remove("show");
    carrouselLeftBtn.classList.add("show");
}

function moveCarouselRight(category) {

    let carrouselContent = document.querySelector("#" + category + "-movies");
    let carrouselLeftBtn = document.querySelector("#" + category + "-left");
    let carrouselRightBtn = document.querySelector("#" + category + "-right");

    carrouselContent.style.left = "0px";
    carrouselRightBtn.classList.add("show");
    carrouselLeftBtn.classList.remove("show");
}


async function buildCarousel(category, name, skip = 0) {

    let cat_name = name;
    if (name === "best")
        cat_name = "";

    const section = document.createElement("section")
    section.classList.add("categories")

    const carousel = document.createElement('div');
    carousel.classList.add('container');

    const categoryTitle = document.createElement('h2');
    if (name === "best")
        categoryTitle.innerHTML = "Films les mieux not??s";
    if (name === "Sci-Fi")
        categoryTitle.innerHTML = "Les meilleurs films de science-fiction";
    if (name === "Western")
        categoryTitle.innerHTML = "Les meilleurs westerns spaghetti";
    if (name === "Comedy")
        categoryTitle.innerHTML = "Les meilleurs Louis de Fun??s";

    carousel.append(categoryTitle);

    const carouselContainer = document.createElement('div');
    carouselContainer.classList.add('carousel-container');

    const carouselContent = document.createElement('div');
    carouselContent.classList.add('carousel-content');
    carouselContent.setAttribute("id", `${name}-movies`)

    document.querySelector('.carousels').appendChild(section);
    let movies = ""
    if (name === "best" || name === "Sci-Fi"){
    movies = await CategoriesBestandSciencefiction(cat_name, skip);
    }else if (name === "Western"){
    movies = await Category2(cat_name, skip);
    }else if (name === "Comedy"){
    movies = await Category3(cat_name, skip);
    }

    let i = 0;
    for (const movie of movies) {
        const box = document.createElement('div');
        box.classList.add("box");
        box.setAttribute("id", `${cat_name}${i + 1}`);
        const movieCover = document.createElement("img");
        movieCover.setAttribute("alt", movie.title);
        //image control
        checkImg1()
        function checkImg1(){
	        let tester=new Image()
	        tester.onload=function() {movieCover.src = movie.image_url;}
	        tester.onerror=function() {movieCover.src = "./JustStreamIt/images/default_cover.jpg"}
	        tester.src = movie.image_url;
        }


        box.appendChild(movieCover);

        const overlay = document.createElement("div");
        overlay.classList.add("overlay");

        const movieTitle = document.createElement("p");
        movieTitle.innerHTML = movie.title;
        overlay.appendChild(movieTitle);

        const modalButton = document.createElement("button");
        modalButton.classList.add("overlay-button");
        modalButton.setAttribute("onclick", `openModal("${movie.id}")`);
        modalButton.innerHTML = "Infos";
        overlay.appendChild(modalButton);

        box.appendChild(overlay);
        carouselContent.appendChild(box);

        i++;
    }

    const controls = document.createElement("div");
    controls.classList.add("controls");

    const leftButton = document.createElement('button');
    leftButton.classList.add('btn');
    leftButton.classList.add('left');
    leftButton.setAttribute('aria-label', `${name} slide left`);
    leftButton.setAttribute('id', `${name}-left`);
    leftButton.setAttribute('onclick', `moveCarouselRight("${name}")`);
    leftButton.innerHTML = "<img src =./JustStreamIt/images/bi-chevron-left.png>";
    controls.appendChild(leftButton);

    const rightButton = document.createElement('button');
    rightButton.classList.add('btn');
    rightButton.classList.add('right');
    rightButton.classList.add('show');
    rightButton.setAttribute('id', `${name}-right`);
    rightButton.setAttribute('aria-label', `${name} slide right`);
    rightButton.setAttribute('onclick', `moveCarouselLeft("${name}")`);
    rightButton.innerHTML = "<img src =./JustStreamIt/images/bi-chevron-right.png>";
    controls.appendChild(rightButton);

    carouselContainer.appendChild(carouselContent);
    carouselContainer.appendChild(controls);

    carousel.appendChild(carouselContainer);
    section.appendChild(carousel);
}

    window.addEventListener('load', () => {
    buildCarousel("Best-rated", "best", 0);
    buildCarousel("Best-rated", "Sci-Fi", 0)
    buildCarousel("Best-rated", "Western", 0)
    buildCarousel("Best-rated", "Comedy", 0)

    BestMovie()
});