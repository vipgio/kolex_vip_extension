chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	(async () => {
		try {
			if (message.action === "urlMatchedTrades") {
				// console.log("URL matched trades:", message.url);
				await getMarketPrices(message.url);
				sendResponse({ success: true });
			} else if (message.action === "urlMatchedLibrary") {
				createDownloadButton(message.url);
				sendResponse({ success: true });
			}
		} catch (error) {
			console.error("Error handling message:", error);
			sendResponse({ error: error.message });
		}
	})();
	return true;
});

const getMarketPrices = async (url) => {
	try {
		const tradeId = url.split("/").pop();
		const { showSpinner } = window.ExtensionUI;
		const { myTotal, theirTotal } = window.ExtensionConfig.selectors;

		showSpinner(myTotal);
		showSpinner(theirTotal);

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
