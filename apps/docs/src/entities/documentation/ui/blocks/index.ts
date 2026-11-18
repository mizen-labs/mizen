import type { ComponentType } from "react";
// The theme file `mizen init --preset vivid` writes into an application.
import vividTheme from "../../../../../../../packages/cli/presets/vivid.css?url";
import { App as AppShell1 } from "./app-shell-1/app";
import { App as AppShell2 } from "./app-shell-2/app";
import { App as Dashboard1 } from "./dashboard-1/app";
import { App as Dashboard2 } from "./dashboard-2/app";
import { App as Settings1 } from "./settings-1/app";
import { App as Settings2 } from "./settings-2/app";

// Each block's root, and the theme it previews in when it has one.
export const blockApps: Record<string, { App: ComponentType; theme?: string }> =
	{
		"app-shell-1": { App: AppShell1 },
		"app-shell-2": { App: AppShell2 },
		"dashboard-1": { App: Dashboard1, theme: vividTheme },
		"dashboard-2": { App: Dashboard2 },
		"settings-1": { App: Settings1 },
		"settings-2": { App: Settings2 },
	};
