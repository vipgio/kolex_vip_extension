chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	(async () => {
		try {
			if (message.action === "urlMatchedTrades") {
				message.type === "kolex"
					? await getMarketPrices(message.url, "kolex")
					: await getMarketPrices(message.url, "kingsleague");
				sendResponse({ success: true });
			} else if (message.action === "urlMatchedLibrary") {
				createDownloadButton(message.url);
				sendResponse({ success: true });
			} else {
				sendResponse({ error: "Invalid action" });
			}
		} catch (error) {
			console.error("Error handling message:", error);
			sendResponse({ error: error.message });
		}
	})();
	return true;
});

const getMarketPrices = async (url, type) => {
	try {
		const tradeId = url.split("/").pop();
		const { showSpinner } = window.ExtensionUI;

		const { myTotal, theirTotal } = window.ExtensionConfig.selectors[type];

		showSpinner(myTotal);
		showSpinner(theirTotal);

		const session = await window.ExtensionStorage.getJWT();
		const jwt = session.jwt;
		const userInfo = await window.ExtensionAPI.getUserInfo(jwt);
		const { data: tradeData } = await window.ExtensionAPI.getTrade(jwt, tradeId);

		const cards = [...tradeData.user1.cards, ...tradeData.user2.cards] ?? [];
		const stickers = [...tradeData.user1.stickers, ...tradeData.user2.stickers] ?? [];
		const prices = await window.ExtensionAPI.getAllMarket(jwt, cards, stickers);

		window.ExtensionTrade.separateItems(tradeData, userInfo.data.id, prices, type);
	} catch (error) {
		console.error(error);
	}
};

const createDownloadButton = (url) => {
	window.ExtensionUI.displayDownloadButtons(url);
};
