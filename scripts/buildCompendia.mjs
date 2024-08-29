import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { existsSync } from "fs";
import { join } from "path";
import { readFile } from "fs/promises";

async function main() {
	const system = JSON.parse(await readFile(`./system.json`, `utf-8`));

	if (!system.packs || system.packs.length === 0) {
		console.log(`No compendium packs defined`);
		process.exit(0);
	};

	for (const compendium of system.packs) {
		console.debug(`Packing ${compendium.label} (${compendium.name})`);
		let src = join(process.cwd(), compendium.path, `_source`);
		if (!existsSync(src)) {
			console.warn(`${compendium.path} doesn't exist, skipping.`)
			continue;
		};
		await compilePack(
			src,
			join(process.cwd(), compendium.path),
			{ recursive: true },
		);
		console.debug(`Finished packing ${compendium.name}`);
	};

	console.log(`Finished packing compendia`)
};

main();
