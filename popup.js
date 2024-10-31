document.addEventListener("DOMContentLoaded", () => {
	const themeToggle = document.getElementById("themeToggle");

	// Load saved settings when popup opens
	chrome.storage.local
		.get(["darkMode"])
		.then((result) => {
			// Set feature toggles

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

	// Listen for system theme changes
	window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
		chrome.storage.local.get(["darkMode"]).then((result) => {
			if (result.darkMode === undefined) {
				updateTheme(e.matches);
			}
		});
	});

	const copyButton = document.getElementById("copyToken");
	checkAndEnableButton(copyButton);

	const originalSvgContent = copyButton.innerHTML;
	copyButton.addEventListener("click", async () => {
		if (copyButton.disabled) return;
		try {
			getToken();
			copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
		} catch (err) {
			console.error("Failed to copy:", err);
		}
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

const getToken = async () => {
	const session = await ExtensionStorage.getJWT();
	const { jwt, expires } = session;
	const textToCopy = JSON.stringify({ jwt, expires });
	await navigator.clipboard.writeText(textToCopy);
};

const checkAndEnableButton = (copyButton) => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const currentUrl = tabs[0].url;
		const targetDomain = "kolex.gg";

		if (currentUrl.includes(targetDomain)) {
			copyButton.disabled = false;
			copyButton.classList.remove("opacity-50", "cursor-not-allowed");
			copyButton.innerHTML = `<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 448 512"
						fill="currentColor"
						class="w-4 h-4"
					>
						<path
							d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"
						/>
					</svg>`;
		} else {
			copyButton.disabled = true;
			copyButton.classList.add("opacity-50", "cursor-not-allowed");
			copyButton.innerHTML = `<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
						fill="currentColor"
						class="w-4 h-4"
					>
						<path
							d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
						/>
					</svg>`;
		}
	});
};
