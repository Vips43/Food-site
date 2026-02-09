import { getDietaryStatus, showSkeleton } from "./misc.js";

const catsDishes = document.querySelector("#catsDishes > div");
const h3 = document.getElementById("h3");

const params = new URLSearchParams(window.location.search);
const category = params.get("category")
const country = params.get("country")
const letter = params.get("letter")

if (letter) {
  const text = "Meals by Letter ";
  const lett = baseUrl(`/api/json/v1/1/search.php?f=${letter.toLocaleLowerCase()}`)
  getByCats(text, letter, lett)
}

if (country) {
  const cntry = baseUrl(`/api/json/v1/1/filter.php?a=${country}`)
  getByCats("Country", country, cntry)
}

if (category) {
  const cats = baseUrl(`/api/json/v1/1/filter.php?c=${category.toLowerCase()}`)
  getByCats("Category", category, cats)
}


function baseUrl(paras) {
  const base = `https://www.themealdb.com`
  const newUrl = base + "/" + paras
  return newUrl;
}

export async function getByCats(txt, c, url) {
  const controller = new AbortController();
  const signal = controller.signal;

  showSkeleton(9, catsDishes);
  try {

    const res = await fetch(url, {signal});
    if (!res?.ok) return console.log(res.status)

    const data = await res.json();
    console.log(data)
    renderCategories(txt, c, data?.meals)
  } catch (error) {
    console.log("there is an error: ", error)
  }
}

export const renderCategories = (txt, c, data) => {
  catsDishes.innerHTML = ``
  const fragment = document.createDocumentFragment();

  h3.textContent = `${txt} : ${c.toUpperCase()} (${data?.length})`

  data?.forEach((meal, index) => {

    const div = document.createElement("div");
    div.className = "w-full dark:bg-neutral-900 rounded-lg bg-white opacity-0 translate-y-6 transition-all duration-1000 ease-out overflow-hidden grid gap-2 pb-1 relative cursor-pointer";

    div.dataset.id = meal?.idMeal;
    div.innerHTML = `
      <img src="${meal?.strMealThumb}/small" loading="lazy"
           class="w-full aspect-square object-cover hover:object-contain" alt="Loading...">
      <h4 class="font-semibold text-sm text-center leading-4 line-clamp-2 px-1">
        ${meal?.strMeal} 
      </h4>
      <span class="absolute top-2 right-2">${getDietaryStatus(category)}</span>
    `;

    setTimeout(() => {
      div.classList.remove("opacity-0", "translate-y-6", "scale-95");
    }, index * 60);

    div.addEventListener("click", () => {
      window.location.href = `mealDetail.html?id=${meal.idMeal}`;
    });

    fragment.append(div);
  });
  catsDishes.append(fragment)
}