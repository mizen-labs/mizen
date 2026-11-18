import { createFileRoute, redirect } from "@tanstack/react-router";

// Apps became Blocks.
export const Route = createFileRoute("/apps/")({
	beforeLoad: () => {
		throw redirect({ href: "/blocks", statusCode: 308 });
	},
});
