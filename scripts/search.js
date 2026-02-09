import { getDietaryStatus, pageLoader } from "./misc.js";

const searchDiv = document.getElementById("search");

const params = new URLSearchParams(window.location.search);
const str = params.get("search")


const loader = pageLoader();

window.addEventListener("load", () => {
  loader.style.opacity = "0";

  setTimeout(() => loader.remove(), 500);
});


export async function getKeyWord(str, ul, search) {
    try {
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${str}`)

        return renderSearchList(res.data, ul, search)
    } catch (error) {
        console.log(error)
    }
}

function renderSearchList(params, ul, search) {
    params.meals.forEach((meal, i) => {
        const li = document.createElement("li");
        li.className = `hover:bg-gray-200 hover:text-black px-1 py-0.5 cursor-pointer`;
        li.textContent = meal.strMeal;
        li.addEventListener("click", () => {
            search.value = li.textContent;
            ul.classList.add("hidden");
        })
        ul.append(li)
    })
}

async function fetchSearch() {
    try {
        const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${str}`)

        return res.data
    } catch (error) {
        console.log(error)
    }
}
// fetchSearch()

async function getSearched() {
    const searches = await fetchSearch();
    searchDiv.innerHTML = ``;

    const fragment = document.createDocumentFragment()
    searches?.meals?.forEach((search, index) => {
        // console.log(search)
        const category = search.strCategory;

        const div = document.createElement("div");
        div.className = "w-full dark:bg-neutral-900 border border-gray-300 rounded-lg bg-white opacity-0 translate-y-6 transition-all duration-1000 ease-out overflow-hidden grid gap-2 pb-1 relative";

        div.dataset.id = search?.idMeal;
        div.innerHTML = `
    <img src="${search?.strMealThumb}/small" loading="lazy"
    class="w-full aspect-square object-cover hover:object-contain" alt="Loading...">
    <h4 class="font-semibold text-sm text-center leading-4 line-clamp-2 px-1">
    ${search?.strMeal} 
    </h4>
    <span class="absolute top-2 right-2">${getDietaryStatus(category)}</span>
    `;
        div.addEventListener("click", () => {
            window.location.href = `mealDetail.html?id=${search.idMeal}`;
        });
        fragment.append(div)
        setTimeout(() => {
            div.classList.remove("opacity-0", "translate-y-4");
        }, index * 80);
    })
    searchDiv.append(fragment)
}
if (searchDiv) {
    getSearched()
}