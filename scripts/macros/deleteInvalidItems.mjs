const invalids = game.items.invalidDocumentIds;
invalids.forEach(id => {
	game.items.getInvalid(id).delete();
});
