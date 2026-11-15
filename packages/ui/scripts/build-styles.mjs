import { readdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import stylex from "@stylexjs/postcss-plugin";
import postcss from "postcss";
import { publicTokens } from "./public-tokens.mjs";

const require = createRequire(import.meta.url);
const workspaceRoot = fileURLToPath(new URL("../../../", import.meta.url));
const config = require("../../../babel.config.js");

// Match the package's Babel transform so shipped class references and CSS agree.
const result = await postcss([
	stylex({
		babelConfig: {
			babelrc: false,
			parserOpts: { plugins: ["typescript", "jsx"] },
			plugins: config.plugins,
		},
		cwd: workspaceRoot,
		include: ["packages/ui/src/**/*.{ts,tsx}"],
	}),
	await publicTokens(new URL("../dist/styles/", import.meta.url)),
]).process("@stylex;", {
	from: fileURLToPath(new URL("../src/styles.css", import.meta.url)),
});

// Rules StyleX cannot express, such as styles for an icon a button holds, live
// in plain CSS beside their component. They join the one stylesheet, so no
// JavaScript module imports CSS and plain Node can load every component.
const sources = fileURLToPath(new URL("../src/components/", import.meta.url));
const componentCss = (
	await Promise.all(
		(
			await readdir(sources, { recursive: true })
		)
			.filter((path) => path.endsWith(".css"))
			.sort()
			.map((path) => readFile(join(sources, path), "utf8"))
	)
).join("\n");

await writeFile(
	new URL("../dist/styles.css", import.meta.url),
	`${result.css}\n${componentCss}`
);
