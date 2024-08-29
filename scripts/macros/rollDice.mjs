async function rollDice() {

	const statBase = await DialogManager.ask({
		question: `How many dice to roll?`,
		initialValue: 2,
		inputType: `number`,
	});

	if (!statBase) {
		return;
	}

	const sidesOnDice = 6;
	const successThreshold = 4;

	let successes = 0;
	const results = [];
	for (let i = statBase; i > 0; i--) {
		let r = new Roll(`1d${sidesOnDice}`);
		await r.evaluate();
		results.push(r.total);
		if (r.total >= successThreshold) {
			successes++;
		}
		if (r.total === sidesOnDice) {
			successes++;
		}
	}

	await ChatMessage.create({
		content: `Rolled: ${results.join(`, `)}<br>Successes: ${successes}`,
	});
}

rollDice()