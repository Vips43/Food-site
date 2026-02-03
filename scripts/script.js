
import { animate, scroll } from "https://cdn.jsdelivr.net/npm/@motionone/dom/+esm";



let main = document.getElementById('main');
const catsUl = document.getElementById("catsUl")
const sideMenu = document.getElementById("sideMenu")
const catsDishes = document.getElementById("catsDishes")
const nav = document.querySelector("nav")

sideMenu.addEventListener("click", () => {
  if (catsUl.classList.contains('translate-x-96')) {
    nav.classList.replace("overflow-hidden", "overflow-visible")
    catsUl.classList.replace('translate-x-96', 'translate-x-0');
    renderCats();
  } else {
    nav.classList.replace("overflow-visible", "overflow-hidden")
    catsUl.classList.replace('translate-x-0', 'translate-x-96');
  }
})

let foodItems = ['noodles', 'pasta', 'burger', 'pizza', 'Arrabiata', 'dal'];


// Wikipedia API fetcher
async function getIngredientData(name) {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function recepieFinder() {
  try {
    const requests = foodItems.map(foo =>
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foo}`)
        .then(r => r.json())
        .catch(() => null)
    );
    const data = await Promise.all(requests)
    localStorage.setItem("food", JSON.stringify(data))
    const ldata = JSON.parse(localStorage.getItem("food")) || []
    if (ldata) { console.log("loaded from loalcl"); return ldata; }
    return data;
  } catch { return null; }
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
  getCategories().then(cats => {
    const fragment = document.createDocumentFragment();

    cats.forEach((cat, index) => {
      catsUl.innerHTML = ``
      const li = document.createElement("li");

      li.className = `
        p-1 hover:bg-gray-100 cursor-pointer flex items-center gap-2
        opacity-0 translate-y-4 transition-all duration-500
      `;

      li.dataset.id = cat.idCategory;
      li.innerHTML = `
        <img src="${cat.strCategoryThumb}" class="h-10" />
        <p class="text-black">${cat.strCategory}</p>
      `;

      li.addEventListener("click", () => {
        getByCats(cat.strCategory)

        nav.classList.replace("overflow-visible", "overflow-hidden")
        catsUl.classList.replace('translate-x-0', 'translate-x-96');
      })
        ;

      fragment.append(li);

      // stagger reveal
      setTimeout(() => {
        li.classList.remove("opacity-0", "translate-y-4");
      }, index * 80);
    });

    catsUl.append(fragment);
  });
}




async function getByCats(meal_name) {
  showSkeleton();
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${meal_name}`
  const res = await fetch(url);
  const data = await res.json();
  console.log(data)
  const fragment = document.createDocumentFragment();
  data.meals.forEach((meal, index) => {
    catsDishes.innerHTML = ``
    const div = document.createElement("div");
    div.className = "w-44 border border-gray-300 rounded-lg bg-white opacity-0 translate-y-6 scale-95 transition-all duration-500 ease-out overflow-hidden grid gap-2 pb-1 hover:scale-100 hover:shadow-md";

    div.dataset.id = meal.idMeal;
    div.innerHTML = `
      <img src="${meal.strMealThumb}" loading="lazy"
           class="w-44 mx-auto object-cover">
      <h4 class="font-semibold text-center leading-4 line-clamp-2 px-1">
        ${meal.strMeal}
      </h4>
    `;

    fragment.append(div);
    setTimeout(() => {
      div.classList.remove("opacity-0", "translate-y-6", "scale-95");
    }, index * 60);
  });
  catsDishes.append(fragment)
}

async function recipeBook() {
  const data = await recepieFinder();
  if (!data) {
    main.innerHTML = "<p class='text-center text-red-600'>Failed to load recipes</p>";
    return;
  }

  const allMeals = data.filter(d => d && d.meals).flatMap(d => d.meals);
  main.innerHTML = "";

  allMeals.forEach(meal => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim() !== "") {
        // Added a clickable span for Wikipedia lookup
        ingredientsList += `
          <li class="cursor-help border-b border-dotted border-gray-400" 
              onclick="alertIngredient('${ing}')">
            ${ing}: ${measure}
          </li>`;
      }
    }
    const mealContainer = document.createElement("div");
    mealContainer.className = "flex-none w-screen h-screen flex flex-wrap lg:flex-nowrap gap-3 md:gap-8 p-10 items-center justify-center snap-start";
    mealContainer.innerHTML = `
      <section class="instruction w-full lg:w-1/3 flex justify-center order-2 lg:order-1">
        <div class="max-w-md text-center">
          <h3 class="font-bold text-2xl mb-4">Instructions</h3>
          <p class="text-xs leading-relaxed text-gray-300">${meal.strInstructions.substring(0, 500)}...</p>
        </div>
      </section>

      <section class="w-full lg:w-1/3 flex flex-col items-center order-2 lg:order-2">
        <h2 class="font-black text-4xl text-center mb-6 uppercase tracking-tighter text-yellow-400">${meal.strMeal}</h2>
        <div class="img_div w-72 md:w-96 rounded-full overflow-hidden shadow-2xl border-8 border-gray-700">
          <img src="${meal.strMealThumb}" class="w-full h-auto object-cover scale-110 hover:scale-100 transition-transform duration-500">
        </div>
      </section>

      <section class="ingredient w-full lg:w-1/3 flex justify-center order-3">
        <div class="max-w-md text-center">
          <h3 class="font-bold text-2xl mb-4">Ingredients</h3>
          <ul class="grid grid-cols-3 gap-3 text-sm">
            ${ingredientsList}
          </ul>
        </div>
      </section>`;

    main.appendChild(mealContainer);
  });
}
// Global function to handle ingredient clicks
window.alertIngredient = async (name) => {
  const info = await getIngredientData(name);
  if (info && info.extract) {
    alert(`${name.toUpperCase()}:\n\n${info.extract}`);
  } else {
    alert(`No extra info found for ${name}`);
  }
};

recipeBook().then(animation);



const innerEffects = [
  {
    img: { transform: ["scale(0.8)", "scale(1)"], opacity: [0, 1] },
    instruction: { opacity: [0, 1], clipPath: ["inset(0 100% 0 100%)", "inset(0 0% 0 0)"] },
    ingredient: { transform: ["opacity(0)", "opacity(1)"], opacity: [0, 1] }
  }
];


function animation() {
  const slides = document.querySelectorAll("#main > div");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;

        const slide = entry.target;
        const img = slide.querySelector(".img_div");
        const instruction = slide.querySelector(".instruction");
        const ingredient = slide.querySelector(".ingredient");
        const items = slide.querySelectorAll(".ingredient li");

        animate(img, innerEffects[0].img, { duration: 0.8, easing: "ease-in-out" })
        animate(instruction, innerEffects[0].instruction, { duration: 1, easing: "ease-in-out" })
        animate(ingredient, innerEffects[0].ingredient, { duration: 0.8, easing: "ease-in-out" })

        // stagger list items
        items.forEach((li, i) => {
          animate(li,
            { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0)"] },
            { delay: i * 0.05, duration: 0.4 }
          );
        });

        // observer.unobserve(slide);
      });
    },
    { root: main, threshold: 0.5 }
  );

  slides.forEach((slide) => observer.observe(slide));
}

