import generatePage from "./generatePage.js"

const text = `
Coming Soon!

    home
`.trim()

const links = [
	{
		text: "home",
		func: "home",
		line: 2
	}
]

const personal = generatePage(text, links)

export default personal
