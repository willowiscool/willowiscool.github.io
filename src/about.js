import generatePage from "./generatePage.js"

const text = `
ABOUT ME                   back

(this is mostly a placeholder
until I figure out something
better)

Welcome to my site! My name is
Willow. I'm eighteen and I live
in Brooklyn, New York. I
recently graduated Stuyvesant
High School and will be
studying at the University of
Rochester this fall.

My hobbies include all things
computers, playing the flute,
playing Minecraft, crocheting,
biking, skiing, and, recently,
doing some makeup every now and
then. Hopefully, by the time
you're reading this, I've
become much better at that.
`.trim()

const links = [
	{
		text: "back",
		func: "home",
		line: 0
	}
]

const about = generatePage(text, links)

export default about;
