const apiUrl = window.ExtensionConfig.apiUrl;

const defaultHeaders = (jwt) => ({
	"Content-Type": "application/json",
	"x-user-jwt": jwt,
});

const fetchData = async (url, options = {}) => {
	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}`);
	}
	return response.json();
};

const api = {
	getUserInfo: async (jwt) => {
		const url = `${apiUrl}/user/info`;
		return fetchData(url, { headers: defaultHeaders(jwt) });
	},

	getTrade: async (jwt, tradeId) => {
		const url = `${apiUrl}/trade/${tradeId}`;
		return fetchData(url, { headers: defaultHeaders(jwt) });
	},

	getMarketInfo: async (jwt, templateIds, page, type) => {
		const url = `${apiUrl}/market/templates?page=${page}&price="asc"&templateIds=${templateIds}&type=${type}`;
		return fetchData(url, { headers: defaultHeaders(jwt) });
	},

	getAllMarket: async (jwt, cards, stickers) => {
		let itemPrices = [];

		const fetchMarketData = async (templateIds, page, type) => {
			const { data } = await api.getMarketInfo(jwt, templateIds, page, type); // Use api.getMarketInfo instead of this.
			itemPrices.push(...data.templates);

			if (data.templates.length > 0) {
				await fetchMarketData(templateIds, page + 1, type);
			}
		};

		if (cards.length > 0) {
			await fetchMarketData(
				cards.map((card) => card.cardTemplateId),
				1,
				"card"
			);
		}

		if (stickers.length > 0) {
			await fetchMarketData(
				stickers.map((sticker) => sticker.stickerTemplateId),
				1,
				"sticker"
			);
		}

		return itemPrices;
	},
};

window.ExtensionAPI = api;
