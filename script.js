const hamburger = document.getElementById("hamburger");
const dropdownContainer = document.getElementById("dropdown-container");
const navItems = document.querySelectorAll(".nav-item");
const searchBox = document.getElementById("search-box")
const searchIcon = document.getElementById("search-icon");
const results = document.getElementById("results");
const mainContent = document.querySelector(".main-content");
let dropdownMenu = null;
let dropdownList = null;

const navArr = ["A: 10.0 - 8.6", "B: 8.5 - 7.1", "C: 7.0 - 5.6", "D: 5.5 - 4.1", "F: 4.0 - 0.0"];


navItems.forEach((item, index) => {
    setTimeout(() => {

        item.classList.add("show")

    }, index * 300);

})





    
hamburger.addEventListener("click", (e) => {
    e.preventDefault();

    if (!dropdownMenu) {
        dropdownMenu = document.createElement("div");
        dropdownList = document.createElement("ul");
        dropdownMenu.appendChild(dropdownList);
        dropdownContainer.appendChild(dropdownMenu)

        navArr.forEach((item) => {
             const li = document.createElement("li");
             li.textContent = item;
             li.classList.add("activeList")
             dropdownList.appendChild(li);
             dropdownContainer.classList.add("active")
        });

    } else {
        dropdownList.remove();
        dropdownMenu = null;
        dropdownContainer.classList.remove("active")
    };


});









async function getData(searchTerm) {
    const url = `https://www.omdbapi.com/?apikey=e0a45e&s=${searchTerm}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response Status: ${response.status}`);
        }

        const json = await response.json();

        if (json.Response === "False") {
            results.innerHTML = `<p>No movies found.</p>`;
            return;
        }

        results.innerHTML = "";
        displayMovies(json.Search);

    } catch (error) {
        console.log("Fetch Error:", error.message);
        results.innerHTML = `<p>Error fetching movies.</p>`;
    }
}


async function getDetails(imdbID) {
    const url = `https://www.omdbapi.com/?apikey=e0a45e&i=${imdbID}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch movie details.");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Details Fetch Error:", error.message);
    }
}





function displayMovies(movies) {
    results.innerHTML = "";

    movies.forEach(async (movie) => {
        const details = await getDetails(movie.imdbID);

        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie");

        movieDiv.innerHTML = `
            <img src="${details.Poster}" alt="${details.Title} Poster" class="poster"/>
            <h3 class="title">${details.Title}</h3>
            <p class="release">${details.Year}</p>
            <p class="rating"><img class="star" src="https://img.icons8.com/?size=100&id=tf9WJOzzs4Wo&format=png&color=000000" alt="star-icon"/>${details.imdbRating}</p>
        `;

        movieDiv.addEventListener("mouseenter", () => {
            const rating = movieDiv.querySelector(".rating");
            if (rating) {
                rating.classList.add("unhide");
            } 
        });

        movieDiv.addEventListener("mouseleave", () => {
            const rating = movieDiv.querySelector(".rating");
            if (rating) {
                rating.classList.remove("unhide");
            } 
        });

        results.appendChild(movieDiv);
    });
}







searchIcon.addEventListener("click", (e) => {
    e.preventDefault();
    const searchTerm = searchBox.value.trim();
    mainContent.classList.add("active");

    if (searchTerm === "") {
        alert("Please enter a movie title!");
        return;
    }

    getData(searchTerm);
    searchBox.value = "";
})


searchBox.addEventListener("keydown", (e) => {

    const searchTerm = searchBox.value.trim();
    mainContent.classList.add("active");

    if (e.key === "Enter") {
        if (searchTerm === "") {
            alert("Please enter a movie title!");
            return;
        }

        getData(searchTerm);
        searchBox.value = "";
    }
})



