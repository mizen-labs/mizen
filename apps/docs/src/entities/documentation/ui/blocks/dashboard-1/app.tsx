import { AppShellFrame } from "./app-shell";
import { type Dashboard, dashboard } from "./data";
import { Home } from "./home";

export function App({ data = dashboard }: { data?: Dashboard }) {
	return (
		<AppShellFrame data={data}>
			<Home data={data} />
		</AppShellFrame>
	);
}
