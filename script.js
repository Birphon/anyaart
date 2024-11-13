// Age Verification Handler
function handleAgeVerification() {
	const modal = document.getElementById("ageVerificationModal");
	const body = document.body;
	const hasVerified = localStorage.getItem("ageVerified");

	function showModal() {
		modal.style.display = "block";
		body.classList.add("modal-open");
	}

	function hideModal() {
		modal.style.display = "none";
		body.classList.remove("modal-open");
	}

	function exitSite() {
		window.location.href = "https://google.com";
	}

	function enterSite() {
		localStorage.setItem("ageVerified", "true");
		hideModal();
	}

	// Set up event listeners
	document.getElementById("exitSite").addEventListener("click", exitSite);
	document.getElementById("enterSite").addEventListener("click", enterSite);

	// Prevent closing modal by clicking outside
	modal.addEventListener("click", (e) => {
		if (e.target === modal) {
			e.preventDefault();
		}
	});

	// Show modal if user hasn't verified age
	if (!hasVerified) {
		showModal();
	}
}

// Run age verification before any other scripts
document.addEventListener("DOMContentLoaded", handleAgeVerification);

// Theme handling
function setTheme(isDark) {
	document.documentElement.classList.toggle("dark-mode", isDark);
	localStorage.setItem("darkMode", isDark);
}

// Initialize theme
const prefersDark =
	localStorage.getItem("darkMode") !== null
		? localStorage.getItem("darkMode") === "true"
		: true; // Default to dark mode
setTheme(prefersDark);

// Theme toggle button
document.getElementById("themeToggle").addEventListener("click", () => {
	const isDark = document.documentElement.classList.toggle("dark-mode");
	localStorage.setItem("darkMode", isDark);
});

// Comic navigation code (keeping your existing code)
let currentPage = 0;

function updatePage() {
	const page = comicPages[currentPage];
	const comicImage = document.getElementById("comicImage");
	const pageNumber = document.getElementById("pageNumber");

	comicImage.src = page.image;
	comicImage.alt = page.title;
	pageNumber.textContent = `Page ${page.id} of ${comicPages.length}`;

	document.getElementById("firstPage").disabled = currentPage === 0;
	document.getElementById("prevPage").disabled = currentPage === 0;
	document.getElementById("nextPage").disabled =
		currentPage === comicPages.length - 1;
	document.getElementById("lastPage").disabled =
		currentPage === comicPages.length - 1;

	const newUrl = `${window.location.pathname}?page=${page.id}`;
	history.pushState({ page: currentPage }, "", newUrl);
}

document.getElementById("firstPage").addEventListener("click", () => {
	currentPage = 0;
	updatePage();
});

document.getElementById("prevPage").addEventListener("click", () => {
	if (currentPage > 0) {
		currentPage--;
		updatePage();
	}
});

document.getElementById("nextPage").addEventListener("click", () => {
	if (currentPage < comicPages.length - 1) {
		currentPage++;
		updatePage();
	}
});

document.getElementById("lastPage").addEventListener("click", () => {
	currentPage = comicPages.length - 1;
	updatePage();
});

document.addEventListener("keydown", (e) => {
	if (e.key === "ArrowLeft" && currentPage > 0) {
		currentPage--;
		updatePage();
	} else if (e.key === "ArrowRight" && currentPage < comicPages.length - 1) {
		currentPage++;
		updatePage();
	}
});

window.addEventListener("load", () => {
	const urlParams = new URLSearchParams(window.location.search);
	const pageParam = parseInt(urlParams.get("page"));

	if (pageParam && pageParam <= comicPages.length) {
		currentPage = pageParam - 1;
	}

	updatePage();
});

window.addEventListener("popstate", (e) => {
	if (e.state && typeof e.state.page !== "undefined") {
		currentPage = e.state.page;
		updatePage();
	}
});
