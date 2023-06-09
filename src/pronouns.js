let context
const pronouned = new Set()
const pronounDecorations = new Map()

async function addPronouns(login) {
	if (pronouned.has(login)) return // decoration already added to this user
	pronouned.add(login)
	const response = await fetch(`https://pronouns.alejo.io/api/users/${login}`)
	/** @type {{id: string, login: string, pronoun_id: string}[]} */
	const json = await response.json()
	for (const { login, pronoun_id } of json) {
		context.visual.user.addDecoration(login, pronounDecorations.get(pronoun_id))
		console.log("Added pronoun", pronoun_id, "to", login)
	}
}

export const plugin = {
	id: "chatties-plugin-pronouns",
	async init(pContext) {
		context = pContext
		const response = await fetch("https://pronouns.alejo.io/api/pronouns")
		/** @type {{name: string, display: string}[]} */
		const pronouns = await response.json()
		for (const { name, display } of pronouns) {
			pronounDecorations.set(name, {
				type: "styled-text",
				text: display,
				css: "display: inline-block; background-color: #fff1; color: #a0a; border: 1px solid pink; padding: 2px; border-radius: 5px;",
			})
		}
	},
	async message(message) {
		await addPronouns(message.sender.login.toLowerCase())
	},
	async channelId(channel, _id) {
		await addPronouns(channel.toLowerCase())
	},
}
