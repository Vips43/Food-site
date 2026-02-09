import { getByCats } from "./category.js";
import { activateLazyImages, animation, getDietaryStatus, getThemeColors, showSkeleton } from "./misc.js";

let serverMsg = `<p class="mt-10 text-center text-2xl font-bold mx-auto ">it seems like Server is not responding & may be server is down or please check your network may be down</p>`

let main = document.getElementById('main');
const catsUl = document.getElementById("catsUl")
const country_ul = document.getElementById("country_ul")
const country_main = document.getElementById("country_main")
const browseByName = document.getElementById("browseByName")

let foodItems = ['noodles', 'pasta', 'burger', 'pizza', 'Arrabiata', 'dal'];

export async function getIngredientData(name) {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`, { signal });
    const detail = await res.json();
    console.log(detail)
    const img = `https://www.themealdb.com/images/ingredients/${name}.png`

    return { detail, img };
  } catch { return null; }
}

async function recepieFinder() {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const requests = foodItems.map(foo =>
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foo}`, { signal })
        .then(r => r.json())
        .catch(() => null)
    );
    if (!requests?.ok) (main.innerHTML = serverMsg)
    const data = await Promise.all(requests)
    localStorage.setItem("food", JSON.stringify(data))
    const ldata = JSON.parse(localStorage.getItem("food")) || []
    if (ldata) { console.log("loaded from loalcl"); return ldata; }
    return data;
  } catch (err) { console.log(err); }
}

async function getCategories() {
  const cached = localStorage.getItem("cats");

  if (cached) {
    return JSON.parse(cached).categories;
  }

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
  const data = await res.json();

  localStorage.setItem("cats", JSON.stringify(data));
  return data.categories;
}

function renderCats() {
  showSkeleton(9, catsUl)
  getCategories().then(cats => {
    catsUl.innerHTML = ``
    const fragment = document.createDocumentFragment();

    cats.forEach((cat, index) => {
      const li = document.createElement("li");
      li.className = `group relative rounded-xl overflow-hidden shadow-lg bg-white dark:bg-neutral-800 cursor-pointer opacity-0 translate-y-6 transition-all duration-500 hover:scale-102 hover:shadow-xl `;

      li.dataset.id = cat.idCategory;
      li.innerHTML = `
        <div class="relative aspect-square overflow-hidden">
          <img src="${cat.strCategoryThumb}" loading="lazy"
              class="lazy-img w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 hover:object-cover">

          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 dark:bg-gradient-to-t dark:from-white/70 dark:via-black/20 to-transparent"></div>

          <h3 class="absolute bottom-2 left-2 text-white font-bold text-sm md:text-base">
            ${cat.strCategory}
          </h3>
        </div>
      `;


      li.addEventListener("click", async () => {
        window.location.href = `./pages/category.html?category=${encodeURIComponent(cat.strCategory)}`;
      });

      fragment.append(li);

      setTimeout(() => {
        li.classList.remove("opacity-0", "translate-y-4");
      }, index * 80);
    });

    activateLazyImages();
    catsUl.append(fragment);
  });
}
if (catsUl) {
  renderCats()
}

// recepie book 
async function recipeBook() {
  const data = await recepieFinder();
  const theme = getThemeColors();

  if (!data) {
    main.innerHTML = "<p class='text-center text-red-600'>Failed to load recipes</p>";
    return;
  }

  const allMeals = data?.filter(d => d && d.meals).flatMap(d => d.meals);
  main.innerHTML = "";

  allMeals.forEach(meal => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ing && ing.trim() !== "") {
        ingredientsList += `
        <li class="cursor-help text-left border-b border-dotted border-gray-400" 
            onclick="alertIngredient('${ing}')">
          <strong class="text-neutral-500 font-work">${ing}</strong> : <span class="font-code" style="color:${theme.font}"> ${measure} </span>
        </li>`;
      }
    }

    const mealContainer = document.createElement("div");
    mealContainer.className = "flex-none w-full min-h-screen flex flex-wrap lg:flex-nowrap gap-6 p-6 md:p-10 items-center justify-center snap-start";
    main.style.background = "var(--slide-bg)";
    mealContainer.style.color = "var(--slide-font)";
    mealContainer.innerHTML = `
      <section class="instruction w-full leading-2 lg:w-1/3 flex justify-center order-2 lg:order-1">
        <div class="max-w-md text-center">
          <h3 class="font-bold text-2xl mb-4 font-heading" style="color:${theme.heading}">Instructions</h3>
          <p class="text-xs leading-relaxed font-code text-gray-300" style="color:var(--slide-heading)">${meal.strInstructions.substring(0, 400)}...</p>
        </div>
      </section>

      <section class="w-full lg:w-1/3 flex flex-col items-center order-2 lg:order-2">
        <h2 class="font-bold text-4xl text-center uppercase tracking-tighter text-yellow-400 font-heading" style="color:var(--slide-heading)">${meal.strMeal} - ${getDietaryStatus(meal.strCategory)}</h2>
        <p class="text-center font-semibold mb-6 underline">${meal.strArea} Dish</p>
        <div class="img_div w-72 md:w-96 rounded-full overflow-hidden shadow-2xl border-8 border-gray-700">
          <img src="${meal.strMealThumb}" class="w-full h-auto object-cover scale-110 hover:scale-100 transition-transform duration-500">
        </div>
      </section>

      <section class="ingredient w-full lg:w-1/3 flex justify-center order-3">
        <div class="max-w-lg text-center">
          <h3 class="font-bold text-2xl mb-4" style="color:var(--slide-heading)">Ingredients</h3>
          <ul class="grid grid-cols-3 gap-1 text-xs capitalize ">
            ${ingredientsList}
          </ul>
        </div>
      </section>`;

    main.appendChild(mealContainer);
  });
}
// Global function to handle ingredient clicks
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

if (main) {
  recipeBook().then(animation);
}


async function getFlags(country_name) {
  const url = `https://restcountries.com/v3.1/name/${country_name}?fullText=true`
  const res = await axios.get(url)
  console.log(res.data)
}

const cache = {}
async function getCountry_Name(key) {
  if (cache[key]) {
    console.log("cahced")
    return renderCountries(cache[key])
  }
  
  const url = `https://www.themealdb.com/api/json/v1/1/list.php?a=list`;
  const res = await axios.get(url);
  const countryNames = res.data;
  
  cache[key] = countryNames;
  console.log("fetched")
  return renderCountries(countryNames);
}
function renderCountries(data){ 
  country_ul.innerHTML = ``;
  country_ul.classList.add("p-5");

  const fragment = document.createDocumentFragment()

  data.meals.forEach((name, i) => {
    const li = document.createElement("li");
    li.className = `
      bg-gray-500 py-2 rounded-lg text-white cursor-pointer hover:underline
      transition-all duration-300 opacity-0 scale-0
    `;
    li.innerText = name?.strArea
    fragment.append(li)

    li.addEventListener("click", (e) => {
      country_ul.querySelectorAll("li").forEach(l => {
        l.classList.replace("text-selected", "text-white");
      })

      e.target.classList.replace("text-white", "text-selected");
      window.location.href = `./pages/category.html?country=${encodeURIComponent(li.innerText)}`;
    })
    setTimeout(() => {
      li.classList.remove("opacity-0", "scale-0")
    }, 50 * i);
  })
  country_ul.append(fragment)
}

let isTrue = false;

if (country_main && country_ul) {
  country_main.querySelector("h3").addEventListener("click", async () => {
    const icon = country_main.querySelector("h3 i");

    if (!isTrue) {
      icon.classList.add("transition-all", "rotate-90");

      country_ul.classList.add("p-5");
      loading(country_ul);
      await getCountry_Name("countries");
      isTrue = true;
    } else {
      icon.classList.remove("rotate-90")
      country_ul.classList.remove("p-5")
      country_ul.innerHTML = ``

      isTrue = false
    }
  })
}

function loading(dummy) {
  country_ul.innerHTML = ``

  const frag = document.createDocumentFragment()
  for (let i = 0; i < 20; i++) {
    const subDiv = document.createElement("div")
    subDiv.className = `bg-gray-800 w-full h-10 animate-pulse rounded-lg`
    frag.append(subDiv)
  }
  dummy.append(frag)
}

function renderBrowseByName() {
  const array = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ]

  const alphas = array.toString().split(",")

  const frag = document.createDocumentFragment();
  browseByName.innerHTML = ``
  alphas.forEach((alpha, i) => {
    const span = document.createElement("span");
    span.className = `hover:font-semibold flex hover:text-amber-600 w-7 h-10 cursor-pointer text-center transition-all duration-700 opacity-0 scale-0`
    span.innerText = `${alpha}/`

    setTimeout(() => {
      span.classList.remove("opacity-0", "scale-0")
    }, 30 * i);

    span.addEventListener("click", (e) => {
      e.preventDefault();
      browseByName.querySelectorAll("span").forEach(s => s.classList.remove("text-amber-600"));
      span.classList.add("text-amber-600", "font-semibold");

      window.location.href = `pages/category.html?letter=${alpha.toLowerCase()}`
    })
    frag.append(span)
  })
  browseByName.append(frag)
}

if (browseByName) {
  const browseByName_h3 = document.querySelector("#browseByNameMain h3");
  const browseByName_Main = document.getElementById("browseByNameMain");

  let isTrue = true;

  browseByName_h3.addEventListener("click", () => {
    const icon = browseByName_h3.querySelector("i");
    if (isTrue) {
      renderBrowseByName()
      icon.classList.add("rotate-90")
      isTrue = false;
    } else {
      browseByName_Main.querySelector("#browseByName").innerHTML = ``
      icon.classList.remove("rotate-90")
      isTrue = true;

    }
  })
}