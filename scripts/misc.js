const root = document.documentElement;
const navbar = document.getElementById("navbar")
async function loadNavbar() {
  const res = await fetch("/navbar.html");
  const html = await res.text();

  navbar.innerHTML = html;

  const themeToggle = document.getElementById("themeToggle");

  themeToggle?.addEventListener("click", () => {
    root.classList.toggle("dark");

    if (root.classList.contains("dark")) {
      localStorage.theme = "dark";
    } else {
      localStorage.theme = "light";
    }
  });

  const search = document.getElementById("search")
  const searchBtn = document.getElementById("searchBtn")

  searchBtn.addEventListener("click", () => {
    const value = runSearch(); toastBar(value)
  })
  search.addEventListener("keydown", e => {
    if (e.key === "Enter") { const value = runSearch(); toastBar(value); };
  })

  function runSearch() {
    if (search.value) {
      return search.value;
    }
  }

}
if (navbar) {
  loadNavbar();
}


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

export const colors = [
  {
    light: {
      bg: "#562F00",
      font: "#FFCE99",
      heading: "#FF9644"  // active for light
    }
  },
  {
    bg: "#15173D",
    font: "#EEEEEE",
    heading: "#982598"
  },
  {
    bg: "#30364F",
    font: "#7AB2B2",
    heading: "#576A8F" //active  for dark
  },
  {
    bg: "#30364F",
    font: "#E1D9BC",
    heading: "#ACBAC4"
  },
  {
    bg: "#0C2C55",
    font: "#629FAD",
    heading: "#296374"
  },
]
// 1. Load saved theme or system preference
if (
  localStorage.theme === "dark" ||
  (!localStorage.theme &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  root.classList.add("dark");
}
const toast = document.getElementById("toast");

function toastBar(text="Sorry this function is not available") {
  console.log("first")
  toast.innerHTML = `${text}<span>✖</span>`
  toast.classList.replace("hidden", "flex")
  toast.style.opacity = 1;

  setTimeout(() => {
    toast.style.opacity = 0;
  }, 2000);

  setTimeout(() => {
    toast.classList.replace("flex", "hidden")
  }, 2500);
}