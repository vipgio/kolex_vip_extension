const config = {
	apiUrl: "https://api.kolex.gg/api/v1",
	selectors: {
		contentBox: 'div[class~="content-box"]',
		theirTotal: ".\\!text-positive-500",
		myTotal: ".\\!text-negative-500",
		downloadButton: ".justify-left",
		videoContent: "video.absolute",
		libraryTitle: 'h2[class*="z-"][class*="1"]:nth-child(3)',
	},
};

window.ExtensionConfig = config;
