const root = document.documentElement;
const navbar = document.getElementById("navbar")

async function loadNavbar() {
  let res = await fetch("./navbar.html");

  if (!res.ok) {
    res = await fetch("./pages/navbar.html");
  }

  if (!res.ok) {
    console.error("Navbar not found");
    return;
  }

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
    runSearch();
  })
  search.addEventListener("keydown", e => {
    if (e.key === "Enter") { runSearch(); };
  })

  function runSearch() {
    if (!search.value) {
      toastBar("please enter value");
      console.log("first")
      return
    };
    window.location.assign(
      new URL("pages/search.html?search=" + encodeURIComponent(search.value), location)
    );
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


const colors = [
  // Cinematic Food Show
  {
    light: {
      bg: "#2B1A0F",
      font: "#FFE8C2",
      heading: "#FF9F43"
    },
    dark: {
      bg: "#1A0F08",
      font: "#FFD9A0",
      heading: "#FF7A1A"
    }
  },
  // Midnight Kitchen
  {
    light: {
      bg: "#2D2F36",
      font: "#EAEAEA",
      heading: "#C084FC"
    },
    dark: {
      bg: "#121318",
      font: "#F5F5F5",
      heading: "#A855F7"
    },
  },
  {
    light: {
      bg: "#1F3A2F",
      font: "#D8F3DC",
      heading: "#52B788"
    },
    dark: {
      bg: "#0F241B",
      font: "#B7E4C7",
      heading: "#40916C"
    }
  },
  // Neon Street Food
  {
    light: {
      bg: "#1B1B2F",
      font: "#F1F1F1",
      heading: "#00FFF5"
    },
    dark: {
      bg: "#0E0E1A",
      font: "#FFFFFF",
      heading: "#FF2E63"
    }
  },
  // Cozy Cafe
  {
    light: {
      bg: "#4B3832",
      font: "#FFF3E0",
      heading: "#FFB347"
    },
    dark: {
      bg: "#2C1E1A",
      font: "#FFE0B2",
      heading: "#FFA726"
    }
  },

]
const randomColor = colors[Math.floor(Math.random() * colors.length)]
export function getThemeColors() {
  const isDark = document.documentElement.classList.contains("dark");
  return isDark ? randomColor.dark : randomColor.light;
}

// 1. Load saved theme or system preference
if (
  localStorage.theme === "dark" ||
  (!localStorage.theme &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  root.classList.add("dark");
}

function toastBar(text = "Sorry this function is not available") {

  const toast = document.createElement("div");
  toast.className = `fixed top-20 md:top-52 left-1/2 z-999 -translate-x-1/2  mx-auto w-fit p-2 flex gap-3 bg-gray-400 opacity-100 transition-all duration-700 rounded-lg`

  toast.innerHTML = `${text}<span class="cursor-pointer">✖</span>`

  document.body.append(toast)

  setTimeout(() => {
    toast.classList.replace("opacity-100", "opacity-0");
  }, 2000);

  setTimeout(() => {
    toast.remove();
  }, 2500);

  toast.querySelector("span").onclick = () => {
    toast.remove()
  }
}

export function activateLazyImages() {
  const imgs = document.querySelectorAll(".lazy-img");

  imgs.forEach(img => {
    if (img.complete) reveal(img);
    else img.addEventListener("load", () => reveal(img));
  });

  function reveal(img) {
    img.classList.remove("opacity-0", "blur-sm", "scale-105")
  }
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const img = entry.target;

    if (img.complete) reveal(img);
    else img.addEventListener("load", () => reveal(img));

    observer.unobserve(img);
  });
});

document.querySelectorAll(".lazy-img").forEach(img => observer.observe(img));


async function translateText(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

  const res = await fetch(url);
  const data = await res.json();
  const pText = data[0].map(chunk => chunk[0]).join("");

  const p = pText
  console.log(pText)
  return p;
}

export async function select(texts) {
  const langSelect = document.getElementById("langSelect");
  if (!langSelect) return;

  const lang = langSelect.value;

  for (const el of texts) {
    const source = el.dataset.original || el.innerText;
    const translated = await translateText(source, lang);
    el.innerText = translated;
  }
};
