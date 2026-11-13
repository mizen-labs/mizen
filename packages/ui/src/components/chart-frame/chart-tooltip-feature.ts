import { tooltip } from "@tanstack/charts/tooltip";
import { portal } from "@tanstack/charts/tooltip/portal";

// Every chart shows its tooltip in the browser's top layer. There it adds no
// scrollable overflow to the chart or its container, no card clips it, and the
// window, not the chart, limits where it goes.
export const chartTooltipFeature = { portal, use: tooltip };
