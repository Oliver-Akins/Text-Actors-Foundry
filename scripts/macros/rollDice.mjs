async function rollDice() {
	const sidesOnDice = 6;

	const answers = await DialogManager.ask({
		id: `eat-the-reich-dice-pool`,
		question: `Set up your dice pool:`,
		inputs: [
			{
				key: `statBase`,
				inputType: `number`,
				defaultValue: 2,
				label: `Number of Dice`,
				autofocus: true,
			},
			{
				key: `successThreshold`,
				inputType: `number`,
				defaultValue: 3,
				label: `Success Threshold (d${sidesOnDice} > X)`,
			},
			{
				key: `critsEnabled`,
				inputType: `checkbox`,
				defaultValue: true,
				label: `Enable Criticals`,
			},
		],
	});
	const { statBase, successThreshold, critsEnabled } = answers;
	let rollMode = game.settings.get(`core`, `rollMode`);



	let successes = 0;
	let critsOnly = 0;
	const results = [];
	for (let i = statBase; i > 0; i--) {
		let r = new Roll(`1d${sidesOnDice}`);
		await r.evaluate();
		let classes = `roll die d6`;

		// Determine the success count and class modifications for the chat
		if (r.total > successThreshold) {
			successes++;
		}
		else {
			classes += ` failure`
		}
		if (r.total === sidesOnDice && critsEnabled) {
			successes++;
			critsOnly++;
			classes += ` success`;
		}

		results.push(`<li class="${classes}">${r.total}</li>`);
	}

	let content = `Rolls:<div class="dice-tooltip"><ol class="dice-rolls">${results.join(``)}</ol></div><hr>Successes: ${successes}<br>Crits: ${critsOnly}`;


	if (rollMode === CONST.DICE_ROLL_MODES.BLIND) {
		ui.notifications.warn(`Cannot make a blind roll from the macro, rolling with mode "Private GM Roll" instead`);
		rollMode = CONST.DICE_ROLL_MODES.PRIVATE;
	}

	const chatData = ChatMessage.applyRollMode(
		{
			title: `Dice Pool`,
			content,
		},
		rollMode,
	);

	await ChatMessage.implementation.create(chatData);
}

rollDice()