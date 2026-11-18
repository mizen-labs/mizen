import { blockApps } from "../../../entities/documentation/ui/blocks";

export default function BlockPreview({ name }: { name: string }) {
	const App = blockApps[name]?.App;
	return <div data-slot="app-preview">{App ? <App /> : null}</div>;
}
