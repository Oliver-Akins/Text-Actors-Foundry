Hooks.on(`renderChatMessage`, (msg, html) => {

	// Short-Circuit when the flag isn't set for the message
	if (msg.getFlag(`taf`, `rollModedContent`)) {
		return;
	}

	const featureFlagEnabled = taf.FEATURES.ROLL_MODE_CONTENT;

	const contentElement = html.find(`.message-content`)[0];
	let content = contentElement.innerHTML;
	if (featureFlagEnabled && msg.blind && !game.user.isGM) {
		content = content.replace(/-=.*?=-/gm, `??`);
	} else {
		content = content.replace(/-=|=-/gm, ``);
	}
	contentElement.innerHTML = content;
});
