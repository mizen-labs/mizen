import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Node resolves ESM imports only with their file extension. Babel and tsc keep
// the source's extensionless specifiers, so each relative import in the built
// JavaScript and declarations gets the extension of the file it names.
const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const SPECIFIER =
	/(?<lead>\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)(?<quote>["'])(?<path>\.\.?\/[^"']*)\k<quote>/gu;
const HAS_EXTENSION = /\.(?:css|js|json)$/u;
const BUILT = /\.(?:js|d\.ts)$/u;

function withExtension(file, specifier) {
	if (HAS_EXTENSION.test(specifier)) {
		return specifier;
	}
	const target = resolve(dirname(file), specifier);
	if (existsSync(`${target}.js`)) {
		return `${specifier}.js`;
	}
	if (existsSync(join(target, "index.js"))) {
		return `${specifier}/index.js`;
	}
	throw new Error(`${file}: cannot resolve ${specifier}`);
}

async function files(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) => {
			const path = join(directory, entry.name);
			return entry.isDirectory() ? files(path) : [path];
		})
	);
	return nested.flat().filter((path) => BUILT.test(path));
}

const all = await files(dist);
await Promise.all(
	all.map(async (file) => {
		const source = await readFile(file, "utf8");
		const output = source.replace(
			SPECIFIER,
			(_match, lead, quote, specifier) =>
				`${lead}${quote}${withExtension(file, specifier)}${quote}`
		);
		if (output !== source) {
			await writeFile(file, output);
		}
	})
);
