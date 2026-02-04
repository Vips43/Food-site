
export function showSkeleton(count = 9, divs) {
  divs.innerHTML = "";

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const skel = document.createElement("div");

    skel.className = `
      w-44 border border-gray-300 rounded-lg bg-white
      grid gap-2 pb-1
    `;

    skel.innerHTML = `
      <div class="skeleton w-full h-28 rounded"></div>
      <div class="skeleton h-4 w-3/4 mx-auto rounded"></div>
      <div class="skeleton h-4 w-1/2 mx-auto rounded"></div>
    `;
    fragment.append(skel);
  }
  divs.append(fragment);
}

export function getDietaryStatus(meal) {
    const vegCategories = ['Vegetarian', 'Vegan'];
    const nonVegCategories = ['Beef', 'Chicken', 'Lamb', 'Pork', 'Seafood', 'Goat'];
    
    if (vegCategories.includes(meal)) {
        return `<span class="material-symbols-outlined text-green-500">square_dot</span>`
    } else if (nonVegCategories.includes(meal)) {
        return `<span class="material-symbols-outlined text-red-500">square_dot</span>`;
    }
    return `<span class="material-symbols-outlined">square_dot</span>`
}

// <span class="material-symbols-outlined">square_dot</span>