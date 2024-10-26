chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete" && tab.url) {
		if (isURLLibrary(tab.url)) {
			chrome.tabs.sendMessage(tabId, { action: "urlMatchedLibrary", url: tab.url }, (response) => {
				if (chrome.runtime.lastError) {
					console.error("Error sending message:", chrome.runtime.lastError);
				}
			});
		} else if (isURLTrade(tab.url)) {
			chrome.tabs.sendMessage(tabId, { action: "urlMatchedTrades", url: tab.url }, (response) => {
				if (chrome.runtime.lastError) {
					console.error("Error sending message:", chrome.runtime.lastError);
				}
			});
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

const isURLTrade = (url) => {
	const urlPattern = new URL(url);
	return urlPattern.hostname === "kolex.gg" && urlPattern.pathname.startsWith("/trades/");
};

const isURLLibrary = (url) => {
	const urlPattern = new URL(url);
	if (urlPattern.hostname === "kolex.gg") {
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
