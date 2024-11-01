const config = {
	apiUrl: "https://api.kolex.gg/api/v1",
	selectors: {
		contentBox: 'div[class~="content-box"]',
		theirTotal: ".\\!text-positive-500",
		myTotal: ".\\!text-negative-500",
		downloadButton: ".justify-left",
		videoContent: "video.absolute",
		libraryTitle: 'h2[class*="z-"][class*="1"]:nth-child(3)',
		kingsleague: {
			contentBox: "div.clamp-screen-width:nth-child(2) > div:nth-child(2)",
			myTotal: ".\\!text-brand-primary",
			theirTotal: ".\\!text-brand-secondary",
			deltaSelector: "div.clamp-screen-width:nth-child(2) > div:nth-child(1) > div:nth-child(2)",
		},
		kolex: {
			contentBox: 'div[class~="content-box"]',
			myTotal: ".\\!text-negative-500",
			theirTotal: ".\\!text-positive-500",
			deltaSelector: "div.gap-8:nth-child(2)",
		},
	},
};

window.ExtensionConfig = config;
