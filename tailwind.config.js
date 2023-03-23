/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,jsx,ts,tsx}",
		"./src/components/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				mabinogi: ["Mabinogi"],
			},
		},
		screens: {
			tablet: "640px",

			labtop: "1024px",

			desktop: "1280px",
		},
	},
	plugins: [],
};
