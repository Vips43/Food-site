let ul = document.getElementById('ul')
let main = document.getElementById('main')

async function getIngredeints(name) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${name}`
    const res = fetch(url);
    const data = await res.json()
    console.log(data);
}
async function recepieFinder() {

    try {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(data.meals[0]);
        return data
    } catch (err) {
        console.error('error', err);

    }
}
// recepieFinder();

// let lis = ul.querySelectorAll('li')
// lis.forEach(li=>{
//     li.addEventListener('click',(e)=>{
//         console.log(e.target.textContent)
//         let data = e.target.textContent
//         getIngredeints(data)
//     })
// })

// async function recipeBook(){

//     let data = await recepieFinder();
//     main.innerHTML = `<div class="border bg-white max-w-5xl max-h-[450px]  space-y-2">
//             <div class="bg-cyan-200 grCenter grid-cols-2">
//                 <div class="col-span-2">
//                     <h2>Food Recepie Name</h2>
//                 </div>
//                 <div>
//                     <p class="capitalize">category: <strong>Italian</strong> <strong>Veg</strong></p>
//                 </div>
//             </div>
//             <!-- container -->
//             <div class="grid grid-cols-2 gap-2">
//                 <!-- left container -->
//                 <div class="px-3 grid gap-2">
//                     <!-- image container-->
//                     <div class="rounded-2xl overflow-hidden">
//                         <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" class="" alt="">
//                     </div>
//                     <!-- ingredients container -->
//                     <div class="p-2 w-full max-h-32 overflow-auto rounded">
//                         <ul class="flex flex-wrap w-full text-sm gap-1">
//                             <li
//                                 class="bg-gray-100 hover:underline capitalize hover:bg-gray-200 w-fit px-2 rounded-md whitespace-nowrap">
//                                 ${data.meals[0].strIngredient1}</li>
//                             <li
//                                 class="bg-gray-100 hover:underline capitalize hover:bg-gray-200 w-fit px-2 rounded-md whitespace-nowrap">
//                                 ${data.meals[0].strIngredient2}</li>
//                             <li
//                                 class="bg-gray-100 hover:underline capitalize hover:bg-gray-200 w-fit px-2 rounded-md whitespace-nowrap">
//                                 ${data.meals[0].strIngredient3}</li>
//                             <li
//                                 class="bg-gray-100 hover:underline capitalize hover:bg-gray-200 w-fit px-2 rounded-md whitespace-nowrap">
//                                 ${data.meals[0].strIngredient4}</li>
//                             <li
//                                 class="bg-gray-100 hover:underline capitalize hover:bg-gray-200 w-fit px-2 rounded-md whitespace-nowrap">
//                                 ${data.meals[0].strIngredient5}</li>
//                             <li
//                                 class="bg-gray-100 hover:underline capitalize hover:bg-gray-200 w-fit px-2 rounded-md whitespace-nowrap">
//                                 ${data.meals[0].strIngredient6}</li>
//                             <li
//                                 class="bg-gray-100 hover:underline capitalize hover:bg-gray-200 w-fit px-2 rounded-md whitespace-nowrap">
//                                 ${data.meals[0].strIngredient7}</li>
//                             <li
//                                 class="bg-gray-100 hover:underline capitalize hover:bg-gray-200 w-fit px-2 rounded-md whitespace-nowrap ${!data.meals[0].strIngredient8 ? 'hidden' : ''}">
//                                 ${data.meals[0].strIngredient8 || ''}</li>
//                             <li
//                                 class="bg-gray-100 hover:underline capitalize hover:bg-gray-200 w-fit px-2 rounded-md whitespace-nowrap ${!data.meals[0].strIngredient9 ? 'hidden' : ''}">
//                                 ${data.meals[0].strIngredient9 || ''}</li>
//                         </ul>
//                     </div>

//                 </div>
//                 <!-- right container -->

//                 <div class="relative bg-amber-900 p-4 h-full">
//                     <!-- recepie overview -->
//                     <div class="absolute h-11/12 grid gap-2">
//                         <ul class="flex flex-wrap h-fit text-sm gap-1 sticky top-0">
//                             <li
//                                 class="bg-amber-600 capitalize hover:bg-amber-200 w-fit px-2 rounded-md ">
//                                 ${data.meals[0].strMeasure1 || ''}</li>
//                             <li
//                                 class="bg-amber-600 capitalize hover:bg-amber-200 w-fit px-2 rounded-md ">
//                                 ${data.meals[0].strMeasure2 || ''}</li>
//                             <li
//                                 class="bg-amber-600 capitalize hover:bg-amber-200 w-fit px-2 rounded-md ">
//                                 ${data.meals[0].strMeasure3 || ''}</li>
//                             <li
//                                 class="bg-amber-600 capitalize hover:bg-amber-200 w-fit px-2 rounded-md ${!data.meals[0].strMeasure4 ? 'hidden' : ''} ">
//                                 ${data.meals[0].strMeasure4 || ''}</li>
//                             <li
//                                 class="bg-amber-600 capitalize hover:bg-amber-200 w-fit px-2 rounded-md ${!data.meals[0].strMeasure5 ? 'hidden' : ''} ">
//                                 ${data.meals[0].strMeasure5 || ''}</li>
//                             <li
//                                 class="bg-amber-600 capitalize hover:bg-amber-200 w-fit px-2 rounded-md ${!data.meals[0].strMeasure6 ? 'hidden' : ''} ">
//                                 ${data.meals[0].strMeasure6 || ''}</li>
//                             <li
//                                 class="bg-amber-600 capitalize hover:bg-amber-200 w-fit px-2 rounded-md ${!data.meals[0].strMeasure7 ? 'hidden' : ''} ">
//                                 ${data.meals[0].strMeasure7 || ''}</li>
//                             <li
//                                 class="bg-amber-600 capitalize hover:bg-amber-200 w-fit px-2 rounded-md ${!data.meals[0].strMeasure8 ? 'hidden' : ''} ">
//                                 ${data.meals[0].strMeasure8 || ''}</li>
//                             <li
//                                 class="bg-amber-600 capitalize hover:bg-amber-200 w-fit px-2 rounded-md ${!data.meals[0].strMeasure9 ? 'hidden' : ''} ">
//                                 ${data.meals[0].strMeasure9 || ''}</li>
//                             <li
//                                 class="bg-amber-600 capitalize hover:bg-amber-200 w-fit px-2 rounded-md ${!data.meals[0].strMeasure10 ? 'hidden' : ''} ">
//                                 ${data.meals[0].strMeasure10 || ''}</li>
//                         </ul>
//                         <div id="scroller" class="overflow-auto">
//                             <p class="text-sm break-words whitespace-normal">${data.meals[0].strInstructions}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>`
// }

// recipeBook();



let uul = document.getElementById('ul')

async function naame() {
    let data = await recepieFinder();

    for (let i = 1; i <= 20; i++) {
        const ingred = data.meals[0][`strIngredient${i}`];  

        let li = document.createElement('li')

        li.classList.add("bg-gray-100", "hover:underline", "capitalize", "hover:bg-gray-200", "w-fit", "px-2", "rounded-md", "whitespace-nowrap")

        li.textContent = ingred;

        if (ingred !== null && ingred !== '') {
            uul.appendChild(li)
        }

    }
}
naame();