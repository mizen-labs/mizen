// Runs tests/create-visual.test.ts against a browser in the Playwright image,
// so screenshots render the same on every machine. The docs preview must be
// running: pnpm build, then vp preview --port 3211.
// MIZEN_VISUAL_UPDATE=1 pnpm test:visual rewrites the baselines.
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const { version } = JSON.parse(
	readFileSync(
		new URL("../node_modules/playwright/package.json", import.meta.url),
		"utf8"
	)
);
const name = "mizen-visual-browser";
const port = 3220;

execFileSync("docker", ["rm", "--force", name], { stdio: "ignore" });
execFileSync("docker", [
	"run",
	"--detach",
	"--add-host=host.docker.internal:host-gateway",
	"--init",
	"--name",
	name,
	"--publish",
	`${port}:${port}`,
	`mcr.microsoft.com/playwright:v${version}-noble`,
	"/bin/sh",
	"-c",
	`npx -y playwright@${version} run-server --port ${port} --host 0.0.0.0`,
]);

try {
	const result = spawnSync(
		"pnpm",
		["exec", "vp", "test", "run", "tests/create-visual.test.ts"],
		{
			env: { ...process.env, MIZEN_VISUAL_WS: `ws://127.0.0.1:${port}/` },
			stdio: "inherit",
		}
	);
	process.exitCode = result.status ?? 1;
} finally {
	execFileSync("docker", ["rm", "--force", name], { stdio: "ignore" });
}
