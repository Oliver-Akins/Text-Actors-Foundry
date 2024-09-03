async function rollDice() {
	const sidesOnDice = 6;

	const answers = await DialogManager.ask({
		id: `eat-the-reich-dice-pool`,
		question: `Set up your dice pool:`,
		inputs: [
			{
				inputType: `number`,
				defaultValue: 2,
				label: `Number of Dice`,
				autofocus: true,
			},
			{
				inputType: `number`,
				defaultValue: 4,
				label: `Success Threshold (d${sidesOnDice} >= X)`,
			},
			{
				inputType: `checkbox`,
				defaultValue: true,
				label: `Enable Criticals`,
			},
		],
	});
	const [ statBase, successThreshold, critsEnabled ] = Object.values(answers);
	const rollMode = game.settings.get(`core`, `rollMode`);

	let successes = 0;
	const results = [];
	for (let i = statBase; i > 0; i--) {
		let r = new Roll(`1d${sidesOnDice}`);
		await r.evaluate();
		results.push(r.total);
		if (r.total >= successThreshold) {
			successes++;
		}
		if (r.total === sidesOnDice && critsEnabled) {
			successes++;
		}
	}

	const chatData = ChatMessage.applyRollMode(
		{
			title: `Dice Pool`,
			content: `Rolled: ${taf.utils.hideMessageText(results.join(`, `))}<br>Successes: ${taf.utils.hideMessageText(successes)}`,
			flags: { taf: {
				rollModedContent: true,
				rollMode,
			} },
		},
		rollMode,
	);

	await ChatMessage.implementation.create(chatData);
}

rollDice()