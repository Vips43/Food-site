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
let food = 'curry';
async function recepieFinder() {
    try {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(data.meals[0]);
        return data
    } catch (err) {
        console.error('error', err);

    }
}

async function recipeBook() {

    let data = await recepieFinder();

    main.innerHTML = `
        <div class="mx-auto  bg-conic-metal max-w-2xl max-h-[600px] space-y-2 rounded-lg">
            <div class="bg-gray-700 text-white grCenter grid-cols-2">
                <div class="col-span-2 text-xl font-bold text-gray-300">
                    <h2>${data.meals[0].strMeal}</h2>
                </div>
                <div>
                    <p class="capitalize ">
                    <span class='text-gray-400'>category:</span> <strong>${data.meals[0].strArea}</strong>
                     <strong>${data.meals[0].strCategory}</strong></p>
                </div>
                <div class="bg-white text-red-700 px-1 rounded-full mb-1 hover:bg-gray-200 shadow-md">
                <a href="${data.meals[0].strYoutube}"><i class="fa-brands fa-youtube"></i></a>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div class="px-3 grid gap-2">
                    <div class="rounded-2xl w-full h- overflow-hidden">
                        <img src=${data.meals[0].strMealThumb} class="h-full bg-contain" alt="">
                    </div>
                    <!-- ingredients container -->
                    <div class="p-2 w-full max-h-28 overflow-auto scroller">
                        <ul id='ingredientUl' class="relative grid w-full text-xs lg:text-sm md:text-sm gap-1">
                        </ul>
                        
                    </div>

                </div>

                <!-- right container -->
                <div class="p-4 row-span-1 text-white">
                    <!-- recepie overview -->
                    <h3 class="font-bold text-xl text-gray-500 my-2">Instructions</h3>
                    <div class="relative grid gap-2 h-[90%] overflow-auto scroller">
                        <div class="absolute w-full">
                            <p class="text-sm break-words whitespace-normal">
                            ${data.meals[0].strInstructions}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    let ingredientUl = document.getElementById('ingredientUl')
    ingredientUl.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = data.meals[0][`strIngredient${i}`];
        const measure = data.meals[0][`strMeasure${i}`];
        const symbol = "\u2192";

        let liTexcontent = `<li class="li w-full bg-gray-100 capitalize flex justify-between hover:bg-gray-200 px-2 py-1 rounded-md"><strong class="strong hover:underline">${ingredient}</strong> ${symbol} <span>${measure}</span></li>`

        if (ingredient) {
            ingredientUl.innerHTML += liTexcontent;
        }
    }
}
// recipeBook();
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
