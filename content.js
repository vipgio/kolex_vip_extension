(async function () {
	chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
		try {
			if (message.action === "urlMatchedTrades") {
				const result = await chrome.storage.local.get("trades");
				if (result.trades) {
					await getMarketPrices(message.url);
				} else {
					console.log("Trades feature is disabled.");
				}
			} else if (message.action === "urlMatchedLibrary") {
				const result = await chrome.storage.local.get("downloader");
				if (result.downloader) {
					await createDownloadButton(message.url);
				} else {
					console.log("Downloader feature is disabled.");
				}
			}
		} catch (error) {
			console.error("Error handling message:", error);
			// Optionally send an error response:
			sendResponse({ error: "An error occurred" });
		}
	});
})();

const getMarketPrices = async (url) => {
	try {
		const tradeId = url.split("/").pop();
		const { showSpinner } = window.ExtensionUI;
		const { selectors } = window.ExtensionConfig;

		showSpinner(selectors.myTotal);
		showSpinner(selectors.theirTotal);

		const jwt = await window.ExtensionStorage.getJWT();
		const userInfo = await window.ExtensionAPI.getUserInfo(jwt);
		const { data: tradeData } = await window.ExtensionAPI.getTrade(jwt, tradeId);

		const cards = [...tradeData.user1.cards, ...tradeData.user2.cards] ?? [];
		const stickers = [...tradeData.user1.stickers, ...tradeData.user2.stickers] ?? [];
		const prices = await window.ExtensionAPI.getAllMarket(jwt, cards, stickers);

		window.ExtensionTrade.separateItems(tradeData, userInfo.data.id, prices);
	} catch (error) {
		console.error(error);
	}
};

const createDownloadButton = (url) => {
	window.ExtensionUI.displayDownloadButtons(url);
};
