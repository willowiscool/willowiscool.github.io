import generatePage from "./generatePage.js"

const text = `
CONTACT ME            back

email -> vityavv@gmail.com
github -> willowiscool
discord -> willow#2639
instagram -> willowis.cool
`.trim()

const links = [
	{
		text: "back",
		func: "home",
		line: 0
	},
	{
		text: "vityavv@gmail.com",
		href: "mailto:vityavv@gmail.com",
		line: 2
	},
	{
		text: "willowiscool",
		href: "https://github.com/willowiscool",
		line: 3
	},
	{
		text: "willowis.cool",
		href: "https://instagram.com/willowis.cool",
		line: 5
	}
]

const contact = generatePage(text, links)

export default contact;
