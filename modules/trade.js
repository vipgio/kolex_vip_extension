const trade = {
	separateItems(items, userId, prices, type) {
		const findUserItems = (id, isCurrentUser) => {
			const userKey = Object.keys(items).find(
				(key) => key.startsWith("user") && (items[key].id === id) === isCurrentUser
			);
			const user = items[userKey];
			return [...(user.cards || []), ...(user.stickers || [])];
		};

		const calculateTotal = (userItems) =>
			userItems.reduce((total, item) => {
				const price =
					prices.find(
						(p) =>
							p.entityTemplateId === item.cardTemplateId ||
							p.entityTemplateId === item.stickerTemplateId
					)?.lowestPrice || 0;
				return total + Number(price);
			}, 0);

		const myItems = findUserItems(userId, true);
		const theirItems = findUserItems(userId, false);

		const myTotal = calculateTotal(myItems);
		const theirTotal = calculateTotal(theirItems);

		window.ExtensionUI.displayTotal(myTotal, theirTotal, type);
		window.ExtensionUI.displayItemPrices(prices, type);
	},
};

window.ExtensionTrade = trade;
