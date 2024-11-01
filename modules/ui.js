const ui = {
	showSpinner(selector) {
		const header = document.querySelector(selector);
		const spinner = document.createElement("div");
		spinner.className = "spinner ml-auto";
		spinner.id = "totalSpinner";
		if (!header) return;
		header.appendChild(spinner);
	},

	appendItem(item, selector) {
		const contentBox = document.querySelector(selector);
		if (!contentBox) return;

		const itemElement = document.createElement("div");
		itemElement.className = "flex items-center justify-between gap-2";
		itemElement.innerHTML = item;
		contentBox.appendChild(itemElement);
	},

	createTotalElement(total, classes) {
		const totalElement = document.createElement("div");
		totalElement.className =
			"rounded-md bg-white border border-black p-2 py-1 ml-auto font-semibold text-lg font-secondary";
		if (classes) {
			totalElement.classList.add(...classes.split(" ").filter(Boolean));
		}
		totalElement.textContent = `$${total.toFixed(2)}`;
		return totalElement;
	},

	// appendTotalToHeader(total, selector, classes) {
	// 	header.append(this.createTotalElement(total, classes));
	// },

	appendTotalToHeader(total, selector, classes, prepend = false) {
		const header = document.querySelector(selector);
		const spinner = document.getElementById("totalSpinner");
		if (spinner) spinner.remove();

		const totalElement = this.createTotalElement(total, classes);

		if (prepend) {
			header.prepend(totalElement);
		} else {
			header.append(totalElement);
		}
	},

	displayTotal(myTotal, theirTotal, type) {
		const {
			myTotal: mySelector,
			theirTotal: theirSelector,
			deltaSelector,
		} = window.ExtensionConfig.selectors[type];
		this.appendTotalToHeader(myTotal, mySelector, "text-negative-500");
		this.appendTotalToHeader(theirTotal, theirSelector, "text-positive-500");
		this.appendTotalToHeader(
			theirTotal - myTotal,
			deltaSelector,
			`${theirTotal - myTotal >= 0 ? "text-positive-500" : "text-negative-500"}`,
			true
		);
	},

	displayItemPrices(prices, type) {
		const contentBox = document.querySelector(window.ExtensionConfig.selectors[type].contentBox);
		if (!contentBox) return;

		const h3Elements = contentBox.querySelectorAll("h3");
		h3Elements.forEach((h3) => {
			const priceValue = prices.find(
				(price) =>
					price.cardTemplate?.title.includes(h3.textContent) ||
					price.stickerTemplate?.title.includes(h3.textContent)
			).lowestPrice;

			h3.classList.add("flex", "items-center", "justify-between", "gap-2");
			h3.classList.remove("max-w-fit");

			const priceSpan = document.createElement("span");
			priceSpan.className = "rounded-md border p-1 ml-auto flex-shrink-0";
			priceSpan.textContent = `${priceValue ? `$${priceValue}` : "-"}`;
			h3.appendChild(priceSpan);
		});
	},

	displayDownloadButtons(url) {
		const createButton = (title, svgContent) => {
			const button = document.createElement("button");
			button.className =
				"rounded-xl text-copy-button text-button font-button-font font-weight-button uppercase h-10 min-w-[10] flex items-center justify-center inline-block overflow-hidden hover:brightness-110 focus:brightness-110 active:-translate-y-0 transition-all disabled:cursor-not-allowed disabled:opacity-10 disabled:grayscale disabled:translate-y-0 disabled:hover:translate-y-0 px-2 aspect-square hover:-translate-y-0.5 text-copy-50 bg-brand-primary text-white group aspect-square";
			button.title = title;
			button.innerHTML = svgContent;
			return button;
		};

		const imageButton = createButton(
			"Download Image",
			`
        <svg xmlns="http://www.w3.org/2000/svg" stroke-width="0" viewBox="0 0 512 512" stroke="currentColor" fill="currentColor" class="w-5 h-5 text-copy-50 group-hover:text-copy-100" height="1em" width="1em">
            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
        </svg>
    `
		);

		const videoButton = createButton(
			"Download Video",
			`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" stroke-width="0" stroke="currentColor" fill="currentColor">
            <path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/>
        </svg>
    `
		);

		const {
			downloadButton: downloadButtonParent,
			videoContent,
			libraryTitle,
		} = window.ExtensionConfig.selectors;

		const appendButton = (button, selector) => {
			const header = document.querySelector(selector);
			header.appendChild(button);
		};

		// appendButton(imageButton, downloadButtonParent);
		setTimeout(() => {
			const videoElement = document.querySelector(videoContent);
			if (!videoElement) return;
			appendButton(videoButton, downloadButtonParent);
			const videoUrl = videoElement.src;

			// imageButton.addEventListener("click", () => {

			// });

			videoButton.addEventListener("click", () => {
				const title = document.querySelector(libraryTitle).textContent;
				chrome.runtime.sendMessage({
					action: "downloadVideo",
					videoUrl: videoUrl,
					filename: `${title}.mp4`,
				});
				console.log("Download video button clicked for URL:", url);
			});
		}, 1000);
	},
};

window.ExtensionUI = ui;
