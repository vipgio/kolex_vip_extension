const ExtensionStorage = {
	getJWT() {
		return new Promise((resolve, reject) => {
			if (chrome?.tabs) {
				chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
					if (!tabs[0]?.id) {
						reject("No active tab found");
						return;
					}

					chrome.scripting.executeScript(
						{
							target: { tabId: tabs[0].id },
							function: () => {
								const session = localStorage.getItem("session");
								return session;
							},
						},
						(result) => {
							if (chrome.runtime.lastError) {
								reject(chrome.runtime.lastError.message);
								return;
							}

							const sessionRaw = result[0].result;
							const sessionParsed = sessionRaw ? JSON.parse(sessionRaw) : null;
							if (sessionParsed) {
								resolve(sessionParsed);
							} else {
								reject("JWT not found");
							}
						}
					);
				});
			} else {
				const session = localStorage.getItem("session");
				const jwt = session ? JSON.parse(session).jwt : null;
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
