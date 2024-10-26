document.addEventListener("DOMContentLoaded", () => {
	const themeToggle = document.getElementById("themeToggle");

	// Load saved settings when popup opens
	chrome.storage.local
		.get(["trades", "downloader", "darkMode"])
		.then((result) => {
			// Set feature toggles
			document.getElementById("trades").checked = result.trades || false;
			document.getElementById("downloader").checked = result.downloader || false;

			// Set theme toggle and initial theme
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			const isDarkMode = result.darkMode !== undefined ? result.darkMode : prefersDark;
			themeToggle.checked = isDarkMode;
			updateTheme(isDarkMode);
		})
		.catch((error) => {
			console.error("Error loading settings:", error);
		});

	// Theme toggle handler
	themeToggle.addEventListener("change", (e) => {
		const isDarkMode = e.target.checked;
		updateTheme(isDarkMode);
		chrome.storage.local.set({ darkMode: isDarkMode });
	});

	// Feature toggle handlers
	document.getElementById("trades").addEventListener("change", (e) => {
		chrome.storage.local.set({ trades: e.target.checked });
	});

	document.getElementById("downloader").addEventListener("change", (e) => {
		chrome.storage.local.set({ downloader: e.target.checked });
	});

	// Listen for system theme changes
	window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
		chrome.storage.local.get(["darkMode"]).then((result) => {
			if (result.darkMode === undefined) {
				updateTheme(e.matches);
			}
		});
	});
});

const updateTheme = (isDark) => {
	const html = document.documentElement;
	const themeIcon = document.getElementById("theme-icon-path");

	if (isDark) {
		html.classList.add("dark");
		// Moon icon
		themeIcon.setAttribute("d", "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z");
	} else {
		html.classList.remove("dark");
		// Sun icon
		themeIcon.setAttribute(
			"d",
			"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
		);
	}
};
