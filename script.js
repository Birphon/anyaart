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

// Comic navigation code
let currentPage = 0;

function updatePage() {
	const page = comicPages[currentPage];
	const comicContainer = document.getElementById("comicContainer");
	const comicImage = document.getElementById("comicImage");
	const pageNumber = document.getElementById("pageNumber");

	// Update basic page info
	comicImage.src = page.image;
	comicImage.alt = page.title;
	pageNumber.textContent = `Page ${page.id} of ${comicPages.length}`;

	// Clear any existing overlay
	const existingOverlay = document.querySelector(".patreon-overlay");
	if (existingOverlay) {
		existingOverlay.remove();
	}

	// Handle Patreon content
	if (page.isPatreonOnly) {
		// Add blur to image
		comicImage.classList.add("patreon-blur");

		// Create overlay
		const overlay = document.createElement("div");
		overlay.className = "patreon-overlay";

		// Add message
		const message = document.createElement("p");
		message.className = "patreon-message";
		message.innerHTML = `
    <span>Patreon Users can see this content first</span>
    <span class="unlock-text">Free unlock coming soon</span>
`;

		// Add Patreon button
		const button = document.createElement("a");
		button.href = patreonConfig.url || "https://www.patreon.com/AnyaArt";
		button.className = "patreon-button";
		button.textContent = "View on Patreon";
		button.target = "_blank";
		button.rel = "noopener noreferrer";

		// Assemble overlay
		overlay.appendChild(message);
		overlay.appendChild(button);

		// Add overlay to wrapper
		document.getElementById("comicWrapper").appendChild(overlay);
	} else {
		// Remove blur if it was previously added
		comicImage.classList.remove("patreon-blur");
	}

	// Update navigation states
	document.getElementById("firstPage").disabled = currentPage === 0;
	document.getElementById("prevPage").disabled = currentPage === 0;
	document.getElementById("nextPage").disabled =
		currentPage === comicPages.length - 1;
	document.getElementById("lastPage").disabled =
		currentPage === comicPages.length - 1;

	const newUrl = `${window.location.pathname}?page=${page.id}`;
	history.pushState({ page: currentPage }, "", newUrl);
}

// Navigation event listeners
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

// Keyboard navigation
document.addEventListener("keydown", (e) => {
	if (e.key === "ArrowLeft" && currentPage > 0) {
		currentPage--;
		updatePage();
	} else if (e.key === "ArrowRight" && currentPage < comicPages.length - 1) {
		currentPage++;
		updatePage();
	}
});

// Preload images
function preloadImages() {
	comicPages.forEach((page) => {
		const img = new Image();
		img.src = page.image;
	});
}

// Initial page load
window.addEventListener("load", () => {
	// Run age verification first
	handleAgeVerification();

	// Check for page parameter in URL
	const urlParams = new URLSearchParams(window.location.search);
	const pageParam = parseInt(urlParams.get("page"));

	if (pageParam && pageParam <= comicPages.length) {
		currentPage = pageParam - 1;
	}

	updatePage();
	preloadImages(); // Start preloading after showing the first page
});

// Handle browser back/forward buttons
window.addEventListener("popstate", (e) => {
	if (e.state && typeof e.state.page !== "undefined") {
		currentPage = e.state.page;
		updatePage();
	}
});
