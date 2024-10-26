const storage = {
	getJWT() {
		return new Promise((resolve, reject) => {
			const session = localStorage.getItem("session");
			const jwt = session ? JSON.parse(session).jwt : null;
			if (jwt) {
				resolve(jwt);
			} else {
				reject("JWT not found");
			}
		});
	},
};

window.ExtensionStorage = storage;
