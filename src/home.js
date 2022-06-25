import generatePage from "./generatePage.js"

const text = `
WILLOW VEYTSMAN        she/they

about projects contact personal
`.trim()

const links = [
	{
		text: "about",
		func: "about",
		line: 2
	},
	{
		text: "projects",
		func: "projects",
		line: 2
	},
	{
		text: "contact",
		func: "contact",
		line: 2
	},
	{
		text: "personal",
		func: "personal",
		line: 2
	}
]

const home = generatePage(text, links)

export default home;
