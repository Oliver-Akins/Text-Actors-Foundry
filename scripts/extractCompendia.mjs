import { readFile } from "fs/promises";
import { join } from "path";
import { extractPack } from "@foundryvtt/foundryvtt-cli";

async function main() {
	const system = JSON.parse(await readFile(`./system.json`, `utf-8`));

	if (!system.packs || system.packs.length === 0) {
		console.log(`No compendium packs defined`);
		process.exit(0);
	};

	for (const compendium of system.packs) {
		console.debug(`Unpacking ${compendium.label} (${compendium.name})`);
		let src = join(process.cwd(), compendium.path, `_source`);
		await extractPack(
			join(process.cwd(), compendium.path),
			src,
			{ recursive: true },
		);
		console.debug(`Finished packing ${compendium.name}`);
	};

	console.log(`Finished unpacking compendia`);
};

main();
