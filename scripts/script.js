
import { animate, scroll } from "https://cdn.jsdelivr.net/npm/@motionone/dom/+esm";
import { colors, getDietaryStatus, showSkeleton } from "./misc.js";

let serverMsg = `<p class="mt-10 text-center text-2xl font-bold mx-auto ">it seems like Server is not responding & may be server is down or please check your network may be down</p>`

let main = document.getElementById('main');
const catsUl = document.getElementById("catsUl")

let foodItems = ['noodles', 'pasta', 'burger', 'pizza', 'Arrabiata', 'dal'];

export async function getIngredientData(name) {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
    const detail = await res.json();
    console.log(detail)
    const img = `https://www.themealdb.com/images/ingredients/${name}.png`

    return { detail, img };
  } catch { return null; }
}

async function recepieFinder() {
  try {
    const requests = foodItems.map(foo =>
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${foo}`)
        .then(r => r.json())
        .catch(() => null)
    );
    if(!requests?.ok) (main.innerHTML= serverMsg )
    const data = await Promise.all(requests)
    localStorage.setItem("food", JSON.stringify(data))
    const ldata = JSON.parse(localStorage.getItem("food")) || []
    if (ldata) { console.log("loaded from loalcl"); return ldata; }
    return data;
  } catch(err) { console.log(err); }
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
    catsUl.innerHTML = ``
    const fragment = document.createDocumentFragment();

    cats.forEach((cat, index) => {
      const li = document.createElement("li");
      li.className = `
        shrink-0 max-w-36 rounded-lg shadow-md overflow-hidden grid gap-2 pb-1 opacity-0 translate-y-4 transition-all duration-500
      `;

      li.dataset.id = cat.idCategory;
      li.innerHTML = `
        <img src='${cat.strCategoryThumb}' alt="">
        <h3 class="text-center font-display">${cat.strCategory} </h3>
      `;

      li.addEventListener("click", () => {
      window.location.href = `category.html?category=${cat.strCategory}`;
    });
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
renderCats()






// recepie book 
async function recipeBook() {
  const data = await recepieFinder();
  const {bg, font, heading} = colors[2]

  console.log(data)
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
            <strong class="text-neutral-500 font-work">${ing}</strong> : <span class="font-code"> ${measure} </span>
          </li>`;
      }
    }
    const mealContainer = document.createElement("div");
    mealContainer.className = "flex-none w-screen min-h-dvh flex flex-wrap lg:flex-nowrap gap-3 md:gap-8 p-10 items-center justify-center snap-start";
    mealContainer.style.background = bg
    mealContainer.innerHTML = `
      <section class="instruction w-full leading-2 lg:w-1/3 flex justify-center order-2 lg:order-1">
        <div class="max-w-md text-center">
          <h3 class="font-bold text-2xl mb-4 font-heading" style="color:${heading}">Instructions</h3>
          <p class="text-xs leading-relaxed font-code text-gray-300" style="color:${font}">${meal.strInstructions.substring(0, 400)}...</p>
        </div>
      </section>

      <section class="w-full lg:w-1/3 flex flex-col items-center order-2 lg:order-2">
        <h2 class="font-bold text-4xl text-center mb-6 uppercase tracking-tighter text-yellow-400 font-heading" style="color:${heading}">${meal.strMeal} - ${getDietaryStatus(meal.strCategory)}</h2>
        <div class="img_div w-72 md:w-96 rounded-full overflow-hidden shadow-2xl border-8 border-gray-700">
          <img src="${meal.strMealThumb}" class="w-full h-auto object-cover scale-110 hover:scale-100 transition-transform duration-500">
        </div>
      </section>

      <section class="ingredient w-full lg:w-1/3 flex justify-center order-3">
        <div class="max-w-lg text-center">
          <h3 class="font-bold text-2xl mb-4" style="color:${heading}">Ingredients</h3>
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



const innerEffects = [
  {
    img: { transform: ["scale(0.8) rotate(180deg)", "rotate(0deg) scale(1)"], opacity: [0, 1] },
    instruction: { opacity: [0, 1], clipPath: ["inset(0 100% 0 100%)", "inset(0 0% 0 0)"] },
    ingredient: { opacity: [0, 1] }
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

        observer.unobserve(slide);
      });
    },
    { root: main, threshold: 0.5 }
  );

  slides.forEach((slide) => observer.observe(slide));
}

