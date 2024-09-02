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

	const m = new ChatMessage({
		title: `Dice Pool`,
		content: `Rolled: ${results.join(`, `)}<br>Successes: ${successes}`,
	});
	m.applyRollMode(game.settings.get(`core`, `rollMode`));
	ui.chat.postOne(m);
}

rollDice()