export function hideMessageText(content) {
	const hideContent = taf.FEATURES.ROLL_MODE_CONTENT;
	if (hideContent) {
		return `-=${content}=-`;
	}
	return content;
};
