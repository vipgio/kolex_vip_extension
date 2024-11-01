const ExtensionStorage = {
	getJWT() {
		return new Promise((resolve, reject) => {
			if (chrome?.tabs) {
				// Query all open tabs in the current window
				chrome.tabs.query({ currentWindow: true }, (tabs) => {
					let found = false;
					const promises = tabs
						.filter(
							(tab) =>
								tab.url &&
								(tab.url.startsWith("https://kolex.gg") ||
									tab.url.startsWith("https://kingsleague.hro.gg/"))
						)
						.map((tab) => {
							return new Promise((resolveTab, rejectTab) => {
								if (!tab.id) {
									rejectTab("No tab ID found");
									return;
								}

								chrome.scripting.executeScript(
									{
										target: { tabId: tab.id },
										function: () => {
											return localStorage.getItem("session");
										},
									},
									(result) => {
										if (chrome.runtime.lastError) {
											rejectTab(chrome.runtime.lastError.message);
											return;
										}

										const sessionRaw = result[0]?.result;
										const sessionParsed = sessionRaw ? JSON.parse(sessionRaw) : null;
										if (sessionParsed && sessionParsed) {
											found = true;
											resolve(sessionParsed);
										} else {
											resolveTab(null); // No JWT in this tab
										}
									}
								);
							});
						});

					// Check for any resolved promise with a JWT
					Promise.all(promises)
						.then((results) => {
							const jwt = results.find((item) => item !== null);
							if (jwt) {
								resolve(jwt);
							} else if (!found) {
								reject("JWT not found in any open kolex.gg tab");
							}
						})
						.catch((error) => {
							reject(error);
						});
				});
			} else {
				// Fallback for non-extension environment
				const session = localStorage.getItem("session");
				const jwt = session ? JSON.parse(session) : null;
				if (jwt) {
					resolve(jwt);
				} else {
					reject("JWT not found");
				}
			}
		});
	},
};

window.ExtensionStorage = ExtensionStorage;
