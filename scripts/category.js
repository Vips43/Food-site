import { getDietaryStatus, showSkeleton } from "./misc.js";

const catsDishes = document.querySelector("#catsDishes > div");
const h3 = document.getElementById("h3");

const params = new URLSearchParams(window.location.search);
const category = params.get("category")



async function getByCats() {
  showSkeleton(9, catsDishes);
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.toLocaleLowerCase()}`
  const res = await fetch(url);
  if(!res?.ok) return console.log(res.status)
    const data = await res.json();
  
  catsDishes.innerHTML = ``
  const fragment = document.createDocumentFragment();
  
  h3.textContent= `Category : ${category.toUpperCase()} (${data.meals.length})`
  data.meals.forEach((meal, index) => {
      
    const div = document.createElement("div");
    div.className = "w-full dark:bg-neutral-900 border border-gray-300 rounded-lg bg-white opacity-0 translate-y-6 transition-all duration-1000 ease-out overflow-hidden grid gap-2 pb-1 relative";

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
getByCats(category)