import { getDietaryStatus } from "./misc.js";
import { getIngredientData } from "./script.js";

const fullMealDetails = document.getElementById("fullMealDetails")

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if(id){
    renderFullmeal(id);

}else{
    fullMealDetails.innerHTML=`<p>No meals found</p>`
}

async function renderFullmeal(id) {
  if (!id) { console.log("returned"); return; }
  fullMealDetails.classList.remove("hidden")
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  const res = await fetch(url);
  const data = await res.json();
  console.log(data)
  const meal = data.meals[0]

  let ingredientsList = ``;
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ing && ing.trim() !== "") {

      ingredientsList += `
          <li class="bg-black/20 p-2 rounded hover:bg-black/40 transition text-left" 
              onclick="alertIngredient('${ing}')">
            <strong class="text-neutral-500">${ing}</strong> : ${measure}
          </li>`;
    }
  }

  fullMealDetails.innerHTML = ``

  const mealContainer = document.createElement("div");
  mealContainer.className = `w-full flex flex-col lg:flex-row gap-8 p-6 md:p-12 text-white `;

  mealContainer.innerHTML = `
  <!-- Instructions -->
  <section class="instruction flex flex-col justify-center space-y-4 order-2 lg:order-1">
    <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tight text-yellow-400 text-center lg:text-left">
      ${meal.strMeal}
      ${getDietaryStatus(meal.strCategory)}
    </h2>

    <h3 class="font-bold text-xl text-center lg:text-left">
      Instructions
    </h3>

    <p class="text-sm leading-relaxed text-gray-100 bg-black/20 p-4 rounded-lg max-h-[60vh] overflow-y-auto scrollbar-hide">
      ${(meal.strInstructions).split(". ").join(".<br>")}
    </p>
  </section>

  <!-- Image -->
  <section class="flex justify-center items-center order-1 lg:order-2">
    <div class="w-72 md:w-96 aspect-square rounded-full overflow-hidden shadow-2xl border-8 border-gray-700">
      <img src="${meal.strMealThumb}"
           class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
    </div>
  </section>

  <!-- Ingredients -->
  <section class="ingredient flex flex-col items-center space-y-4 order-3">
    <h3 class="font-bold text-xl">Ingredients</h3>

    <ul class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm w-full">
      ${ingredientsList}
    </ul>
  </section>
`;


  fullMealDetails.append(mealContainer)
}

window.alertIngredient = async (name) => {
  const data = await getIngredientData(name);
  if (!data) return;

  const { detail, img } = data;

  const box = document.createElement("div");
  box.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-[999]";

  box.innerHTML = `
    <div class="bg-white p-6 max-w-md rounded shadow text-black relative">
      <button class="absolute top-2 right-2">✕</button>
      <img src="${img}" class="w-44 mx-auto mb-4">
      <h3 class="font-bold text-lg mb-2 text-center">${name}</h3>
      <p class="text-sm">${detail.extract}</p>
    </div>
  `;

  box.querySelector("button").onclick = () => box.remove();
  document.body.append(box);
};