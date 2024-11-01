function isValidKolexURL(url) {
	return url.startsWith("https://kolex.gg/") || url.startsWith("https://kingsleague.hro.gg/");
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete" && tab.url && isValidKolexURL(tab.url)) {
		if (isURLLibrary(tab.url)) {
			chrome.tabs.sendMessage(
				tabId,
				{
					action: "urlMatchedLibrary",
					url: tab.url,
				},
				(response) => {
					if (chrome.runtime.lastError) {
						console.error("Error sending library message:", {
							error: chrome.runtime.lastError.message,
							url: tab.url,
							tabId,
						});
					} else {
						console.log("Library message sent successfully:", response);
					}
				}
			);
		} else if (isURLTrade(tab.url)) {
			chrome.tabs.sendMessage(
				tabId,
				{
					action: "urlMatchedTrades",
					url: tab.url,
					type: tab.url.includes("kolex.gg") ? "kolex" : "kingsleague",
				},
				(response) => {
					if (chrome.runtime.lastError) {
						console.error("Error sending trade message:", {
							error: chrome.runtime.lastError.message,
							url: tab.url,
							tabId,
						});
					} else {
						console.log("Trade message sent successfully:", response);
					}
				}
			);
		}
	}
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "downloadVideo") {
		chrome.downloads.download({
			url: request.videoUrl,
			filename: request.filename,
		});
	}
});

chrome.runtime.onInstalled.addListener(() => {
	const urlsToCheck = ["https://kolex.gg/*", "https://kingsleague.hro.gg/*"];

	urlsToCheck.forEach((urlPattern) => {
		chrome.tabs.query({ url: urlPattern }, (tabs) => {
			tabs.forEach((tab) => {
				const files = [
					"modules/config.js",
					"modules/storage.js",
					"modules/api.js",
					"modules/ui.js",
					"modules/trade.js",
					"content.js",
				];

				files.forEach((file) => {
					chrome.scripting.executeScript({
						target: { tabId: tab.id },
						files: [file],
					});
				});
			});
		});
	});
});

const isURLTrade = (url) => {
	const urlPattern = new URL(url);
	return (
		(urlPattern.hostname === "kolex.gg" || urlPattern.hostname === "kingsleague.hro.gg") &&
		urlPattern.pathname.startsWith("/trades/")
	);
};

const isURLLibrary = (url) => {
	const urlPattern = new URL(url);
	if (urlPattern.hostname === "kolex.gg" || urlPattern.hostname === "kingsleague.hro.gg") {
		const pathSegments = urlPattern.pathname.split("/");

		if (
			(pathSegments[1] === "card" || pathSegments[1] === "sticker") &&
			isUUID(pathSegments[2]) &&
			isUUID(pathSegments[3])
		) {
			return true;
		}
	}
	return false;
};

const isUUID = (str) => {
	return str.length === 36 && /^[a-fA-F0-9-]+$/.test(str);
};
