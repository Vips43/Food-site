let ul = document.getElementById('ul')
let main = document.getElementById('main')

async function getIngredientData(name) {
    try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
        // 👇 Important: check if response is OK (status 200–299)
        if (!res.ok) {
            console.warn(`Wikipedia page not found for ${name}`);
            return null; // ensures "data" is null below
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}


// getIngredeints('garlic')
// let food = 'noodles';
let foodItems = ['noodles', 'pasta', 'burger', 'pizza'];
async function recepieFinder() {
    try {
        const url = foodItems.map(foo =>
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${foo}`
        );
        const res = await Promise.all(url.map(url => fetch(url)));
        const data = await Promise.all(res.map(res => res.json()));

        data.forEach(data => {
            if (data.meals) {
                console.log(data.meals[0]);
            } else {
                console.log('No meal found');
            }
        })

        return data
    }
    catch (err) {
        console.error('error', err);
    }
}


async function recipeBook() {

    let data = await recepieFinder();
    const allMeals = data
        .filter(d => d.meals) // remove null ones
        .flatMap(d => d.meals);

    main.innerHTML = "";


    allMeals.forEach(meal => {

        let ingredientUl = '';
        ingredientUl.innerHTML = '';
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            const symbol = "\u2192";

            let liTexcontent = `<li class="li w-full bg-gray-100 capitalize flex justify-between hover:bg-gray-200 px-2 py-1 rounded-md"><strong class="strong hover:underline">${ingredient}</strong> ${symbol} <span>${measure}</span></li>`

            if (ingredient) {
                ingredientUl += liTexcontent;
            }
        }




    main.innerHTML += `
      <div class="meal-card mx-auto bg-conic-metal max-w-2xl max-h-[600px] space-y-2 rounded-lg cursor-pointer transition-all hover:shadow-lg" data-id="${meal.idMeal}">
        <div class="bg-gray-700 text-white grCenter grid-cols-2 p-2">
          <div class="col-span-2 text-xl font-bold text-gray-300">
            <h2>${meal.strMeal}</h2>
          </div>
          <div>
            <p class="capitalize">
              <span class='text-gray-400'>category:</span> 
              <strong>${meal.strArea}</strong>
              <strong>${meal.strCategory}</strong>
            </p>
          </div>
          <div class="bg-white text-red-700 px-1 rounded-full mb-1 hover:bg-gray-200 shadow-md">
            <a href="${meal.strYoutube}" target="_blank"><i class="fa-brands fa-youtube"></i></a>
          </div>
        </div>

        <!-- ✅ Collapsible Content -->
        <div class="meal-details transition-all duration-300">
          <div class="grid grid-cols-2 gap-2 p-2">
            <div class="px-3 grid gap-2 mb-3">
              <div class="rounded-2xl w-full overflow-hidden">
                <img src="${meal.strMealThumb}" class="h-full bg-contain" alt="">
              </div>

              <!-- Ingredients -->
              <div class="p-2 w-full max-h-28 overflow-auto scroller">
                <ul class="relative grid w-full text-xs lg:text-sm md:text-sm gap-1">
                  ${ingredientUl}
                </ul>
              </div>
            </div>

            <!-- Right container -->
            <div class="p-4 row-span-1 text-white">
              <h3 class="font-bold text-xl text-gray-500 my-2">Instructions</h3>
              <div class="relative grid gap-2 h-[90%] overflow-auto scroller">
                <div class="absolute w-full">
                  <p class="text-sm break-words whitespace-normal">
                    ${meal.strInstructions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    });
    
}




recipeBook();






window.onload = async function () {
    await recipeBook();
    let li = document.querySelectorAll('.li')
    li.forEach((i) => {
        let name = i.querySelector('strong')
        if (!name) return;
        name.style.cursor = 'pointer';
        name.addEventListener('click', async (e) => {
            let ingredientName = e.target.textContent;
            const rect = e.target.getBoundingClientRect();
            //remove any existing popup by default;
            document.querySelectorAll(".ingredient-popup").forEach(p => p.remove());
            //create popup
            let popup = document.createElement('div')
            popup.classList.add("ingredient-popup", "absolute", "z-[999]", "w-72", "h-28", "flex", "justify-between", "gap-2", 'p-2', "text-xs", "border", "border-gray-200", "rounded-2xl", "bg-white", "shadow-lg", "overflow-hidden")
            popup.style.top = `${rect.top + window.scrollY + (-110)}px`;
            popup.style.left = `${rect.left + window.scrollX}px`;
            //get dataa
            const data = await getIngredientData(ingredientName);

            if (data && data.displaytitle) {
                popup.innerHTML = `
                    <div class='h-full overflow-hidden transition-all'>
                    <img 
                        src="${data.thumbnail?.source || 'https://via.placeholder.com/150'}" 
                        class='h-full bg-contain rounded-lg hover:scale-[1.3]' 
                        alt="${data.displaytitle || 'No image'}" 
                    />
                    </div>
                    <div class='overflow-y-auto scrollbar-hidden w-1/2'>
                    <strong>${data.displaytitle || 'Unknown Ingredient'}</strong>
                    <p>${data.extract_html || 'No description available.'}</p>
                    </div>
                `;
            } else {
                popup.innerHTML = "<p>No info available for this ingredient</p>";
            }
            document.body.appendChild(popup);
            setTimeout(() => {
                document.addEventListener('click', outsideClickHandler);
            }, 0);
            function outsideClickHandler(e) {
                if (!popup.contains(e.target) && e.target !== name) {
                    popup.remove();
                    document.removeEventListener('click', outsideClickHandler);
                }
            }
        })
    })
}
