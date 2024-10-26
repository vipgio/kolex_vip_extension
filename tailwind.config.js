// tailwind.config.js
module.exports = {
	content: ["./popup.html"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"firefox-light": "#fbfbfe",
				"firefox-dark": "#2b2a33",
				"firefox-blue": "#0060df",
				"firefox-hover-light": "#f0f0f4",
				"firefox-hover-dark": "#42414d",
			},
		},
	},
	plugins: [],
};
