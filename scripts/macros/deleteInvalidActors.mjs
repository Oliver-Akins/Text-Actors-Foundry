const invalids = game.actors.invalidDocumentIds;
invalids.forEach(id => {
	game.actors.getInvalid(id).delete();
});
