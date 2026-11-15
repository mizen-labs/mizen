"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { props } from "@stylexjs/stylex";
import {
	Children,
	type ComponentPropsWithRef,
	createContext,
	type MouseEvent,
	type ReactNode,
	type PointerEvent as ReactPointerEvent,
	useCallback,
	useContext,
	useId,
	useMemo,
	useState,
	useSyncExternalStore,
} from "react";
import type { Closed } from "../../closed";
import {
	IconChevronDown,
	IconLayoutSidebarLeftCollapse,
	IconLayoutSidebarLeftExpand,
} from "../../icons";
import { assignRef } from "../../ref-utils";
import { protectRenderSlot } from "../../render-utils";
import { badgeFit } from "../../styles/badge-fit.styles";
import { Button } from "../button/button";
import {
	Collapsible,
	CollapsiblePanel,
	CollapsibleTrigger,
} from "../collapsible/collapsible";
import { Drawer, DrawerContent, DrawerPopup } from "../drawer/drawer";
import { ScrollArea } from "../scroll-area/scroll-area";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import { appShellStyles as styles } from "./app-shell.styles";

// The width from which the navigation is a sidebar. It matches the md
// breakpoint of the styles.
const WIDE_QUERY = "(min-width: 48rem)";

function subscribe(notify: () => void) {
	const query = window.matchMedia(WIDE_QUERY);
	query.addEventListener("change", notify);
	return () => query.removeEventListener("change", notify);
}
const isWide = () => window.matchMedia(WIDE_QUERY).matches;
// The server renders the sidebar; CSS hides it on a narrow screen until the
// client knows the width.
const wideOnServer = () => true;

// A collapsed sidebar is hidden, shown while the pointer rests on the edge,
// or leaving. Only a sidebar that was shown slides out; one that the trigger
// collapses goes at once, so no card flashes over the content.
type Peek = "hidden" | "leaving" | "shown";

interface ShellState {
	drawerOpen: boolean;
	mainId: string;
	open: boolean;
	peek: Peek;
	setDrawerOpen: (open: boolean) => void;
	setOpen: (open: boolean) => void;
	setPeek: (peek: Peek) => void;
	wide: boolean;
}

const SIDEBAR = '[data-slot="app-shell-sidebar"]';

const ShellContext = createContext<ShellState | null>(null);

function useShell(part: string) {
	const shell = useContext(ShellContext);
	if (!shell) {
		throw new Error(`${part} must be inside AppShell.`);
	}
	return shell;
}

type DivProps = Omit<Closed<ComponentPropsWithRef<"div">>, "role">;

export type AppShellProps = DivProps & {
	/** A sidebar and an AppShellInset. */
	children: ReactNode;
	/** Whether the sidebar is open on a wide screen, when it starts uncontrolled. */
	defaultSidebarOpen?: boolean;
	/** Called when the sidebar opens or closes on a wide screen. Save it here. */
	onSidebarOpenChange?: (open: boolean) => void;
	/** Whether the sidebar is open on a wide screen. */
	sidebarOpen?: boolean;
	/** The text of the link that skips to the content. */
	skipLinkLabel?: string;
};

/**
 * The frame of an application: a sidebar beside one inset surface. From the
 * md breakpoint the sidebar sits beside the content; below it, it opens in a
 * drawer. Collapsed, the sidebar hides and shows again when the pointer rests
 * on the start edge of the window.
 */
export function AppShell({
	children,
	defaultSidebarOpen = true,
	onSidebarOpenChange,
	ref: forwardedRef,
	sidebarOpen,
	skipLinkLabel = "Skip to content",
	...rest
}: AppShellProps) {
	const wide = useSyncExternalStore(subscribe, isWide, wideOnServer);
	const [ownOpen, setOwnOpen] = useState(defaultSidebarOpen);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [peek, setPeek] = useState<Peek>("hidden");
	const open = sidebarOpen ?? ownOpen;
	const mainId = `${useId()}main`;
	const setOpen = useCallback(
		(next: boolean) => {
			setOwnOpen(next);
			setPeek("hidden");
			onSidebarOpenChange?.(next);
		},
		[onSidebarOpenChange]
	);
	const shell = useMemo(
		() => ({
			drawerOpen,
			mainId,
			open,
			peek,
			setDrawerOpen,
			setOpen,
			setPeek,
			wide,
		}),
		[drawerOpen, mainId, open, peek, setOpen, wide]
	);
	const showPeek = useCallback(() => setPeek("shown"), []);
	// A pointer that leaves the edge for anywhere but the sidebar hides it.
	const leaveEdge = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
		const next = event.relatedTarget;
		if (!(next instanceof Element && next.closest(SIDEBAR))) {
			setPeek((current) => (current === "shown" ? "leaving" : current));
		}
	}, []);
	return (
		<ShellContext value={shell}>
			<div
				{...rest}
				data-sidebar={open ? "open" : "collapsed"}
				data-slot="app-shell"
				ref={forwardedRef}
				{...props(styles.root, !open && styles.collapsed)}
			>
				<a href={`#${mainId}`} {...props(styles.skipLink)}>
					{skipLinkLabel}
				</a>
				{open ? null : (
					<div
						aria-hidden="true"
						data-slot="app-shell-edge"
						onPointerEnter={showPeek}
						onPointerLeave={leaveEdge}
						{...props(styles.edge)}
					/>
				)}
				{children}
			</div>
		</ShellContext>
	);
}

export type AppShellSidebarProps = DivProps & {
	/** Names the navigation drawer on a narrow screen. */
	"aria-label": string;
	/** The header, the content, and the footer of the sidebar. */
	children: ReactNode;
	/** The accessible name of the drawer's close button. */
	closeLabel?: string;
};

// A press on a link inside the drawer navigates, so the drawer closes.
function closeOnNavigate(close: () => void) {
	return (event: MouseEvent<HTMLDivElement>) => {
		if (event.target instanceof Element && event.target.closest("a[href]")) {
			close();
		}
	};
}

function hasOpenPopup(element: HTMLElement) {
	return element.querySelector("[data-popup-open]") !== null;
}

// The collapsed sidebar shows while the pointer or focus is inside it, and
// hides when both leave or Escape is pressed. An open menu inside keeps it.
function useFloating(
	floating: boolean,
	setPeek: (peek: Peek) => void,
	forwardedRef: AppShellSidebarProps["ref"]
) {
	return useCallback(
		(element: HTMLDivElement | null) => {
			const release = assignRef(forwardedRef, element);
			if (!(element && floating)) {
				return release;
			}
			const hide = () => {
				if (!hasOpenPopup(element)) {
					setPeek("leaving");
				}
			};
			// The sidebar rests a little in from the window edge, so a pointer
			// on the edge is beside it, not gone.
			const leave = (event: PointerEvent) => {
				if (event.clientX > element.getBoundingClientRect().left) {
					hide();
				}
			};
			const leaveFocus = (event: FocusEvent) => {
				const next = event.relatedTarget;
				if (!(next instanceof Node && element.contains(next))) {
					hide();
				}
			};
			const closeOnEscape = (event: KeyboardEvent) => {
				if (event.key === "Escape") {
					setPeek("leaving");
				}
			};
			element.addEventListener("pointerleave", leave);
			element.addEventListener("focusout", leaveFocus);
			element.addEventListener("keydown", closeOnEscape);
			return () => {
				release?.();
				element.removeEventListener("pointerleave", leave);
				element.removeEventListener("focusout", leaveFocus);
				element.removeEventListener("keydown", closeOnEscape);
			};
		},
		[floating, forwardedRef, setPeek]
	);
}

function NavigationDrawer({
	children,
	closeLabel,
	label,
}: {
	children: ReactNode;
	closeLabel: string;
	label: string;
}) {
	const { drawerOpen, setDrawerOpen } = useShell("AppShellSidebar");
	const close = useCallback(() => setDrawerOpen(false), [setDrawerOpen]);
	return (
		<Drawer onOpenChange={setDrawerOpen} open={drawerOpen} position="left">
			<DrawerPopup
				aria-label={label}
				closeProps={{ "aria-label": closeLabel }}
				onClick={closeOnNavigate(close)}
				showCloseButton
			>
				<DrawerContent
					render={
						<div
							data-slot="app-shell-sidebar"
							{...props(styles.sidebar, styles.inDrawer)}
						/>
					}
				>
					{children}
				</DrawerContent>
			</DrawerPopup>
		</Drawer>
	);
}

function sidebarLook(floating: boolean, hidden: boolean, peek: Peek) {
	if (!floating) {
		return styles.sidebar;
	}
	if (!hidden) {
		return [styles.sidebar, styles.floating];
	}
	return [
		styles.sidebar,
		styles.floating,
		styles.floatingHidden,
		peek === "hidden" && styles.floatingInstant,
	];
}

/** The navigation column. Its content moves into a drawer on a narrow screen. */
export function AppShellSidebar({
	children,
	closeLabel = "Close navigation",
	ref: forwardedRef,
	...rest
}: AppShellSidebarProps) {
	const { open, peek, setPeek, wide } = useShell("AppShellSidebar");
	const floating = wide && !open;
	const hidden = floating && peek !== "shown";
	const ref = useFloating(floating, setPeek, forwardedRef);
	if (!wide) {
		return (
			<NavigationDrawer closeLabel={closeLabel} label={rest["aria-label"]}>
				{children}
			</NavigationDrawer>
		);
	}
	return (
		<div
			{...rest}
			data-slot="app-shell-sidebar"
			data-state={floating ? "floating" : "docked"}
			inert={hidden || undefined}
			ref={ref}
			{...props(sidebarLook(floating, hidden, peek))}
		>
			{children}
		</div>
	);
}

export type AppShellSidebarRegionProps = DivProps;

/** The top of the sidebar: the product, then search. */
export function AppShellSidebarHeader({
	ref: forwardedRef,
	...rest
}: AppShellSidebarRegionProps) {
	return (
		<div
			{...rest}
			data-slot="app-shell-sidebar-header"
			ref={forwardedRef}
			{...props(styles.region, styles.headerText)}
		/>
	);
}

/** The bottom of the sidebar: the account menu. It stays in view. */
export function AppShellSidebarFooter({
	ref: forwardedRef,
	...rest
}: AppShellSidebarRegionProps) {
	return (
		<div
			{...rest}
			data-slot="app-shell-sidebar-footer"
			ref={forwardedRef}
			{...props(styles.region, styles.footer)}
		/>
	);
}

export type AppShellNavProps = Omit<
	Closed<ComponentPropsWithRef<"nav">>,
	"role"
> & {
	"aria-label": string;
	children: ReactNode;
};

/** The navigation groups. It scrolls while the header and the footer stay. */
export function AppShellNav({
	children,
	ref: forwardedRef,
	...rest
}: AppShellNavProps) {
	return (
		<div data-slot="app-shell-nav-scroll" {...props(styles.content)}>
			<ScrollArea fill overscrollContain scrollFade>
				<nav
					{...rest}
					data-slot="app-shell-nav"
					ref={forwardedRef}
					{...props(styles.nav)}
				>
					{children}
				</nav>
			</ScrollArea>
		</div>
	);
}

export type AppShellGroupProps = DivProps & {
	children: ReactNode;
	/** Lets the reader fold the group. The app may control it with open. */
	collapsible?: boolean;
	defaultOpen?: boolean;
	/** The name of the group. Leave it out for the first, unnamed group. */
	label?: ReactNode;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
};

function GroupLabel({ id, label }: { id: string; label: ReactNode }) {
	return (
		<div
			data-slot="app-shell-group-label"
			id={id}
			{...props(styles.groupLabel)}
		>
			<span {...props(styles.itemLabel)}>{label}</span>
		</div>
	);
}

// Each item is a list item, so a screen reader announces the size of the
// group and its name.
function GroupItems({
	children,
	labelId,
}: {
	children: ReactNode;
	labelId: string | undefined;
}) {
	return (
		<ul aria-labelledby={labelId} {...props(styles.groupItems)}>
			{Children.map(children, (child) =>
				child === null || child === undefined || child === false ? null : (
					<li {...props(styles.listItem)}>{child}</li>
				)
			)}
		</ul>
	);
}

/** A named set of items. A collapsible group folds under its label. */
export function AppShellGroup({
	children,
	collapsible = false,
	defaultOpen = true,
	label,
	onOpenChange,
	open,
	ref: forwardedRef,
	...rest
}: AppShellGroupProps) {
	const labelId = useId();
	const named = label !== undefined && label !== null;
	if (!(collapsible && named)) {
		return (
			<div
				{...rest}
				data-slot="app-shell-group"
				ref={forwardedRef}
				{...props(styles.group)}
			>
				{named ? <GroupLabel id={labelId} label={label} /> : null}
				<GroupItems labelId={named ? labelId : undefined}>
					{children}
				</GroupItems>
			</div>
		);
	}
	return (
		<Collapsible
			defaultOpen={defaultOpen}
			onOpenChange={onOpenChange}
			open={open}
			render={
				<div
					{...rest}
					data-slot="app-shell-group"
					ref={forwardedRef}
					{...props(styles.group)}
				/>
			}
		>
			<CollapsibleTrigger
				id={labelId}
				render={
					<button
						type="button"
						{...props(styles.groupLabel, styles.groupTrigger)}
					/>
				}
			>
				<span {...props(styles.itemLabel)}>{label}</span>
				<IconChevronDown aria-hidden="true" size={12} stroke={2} />
			</CollapsibleTrigger>
			<CollapsiblePanel gap="0">
				<GroupItems labelId={labelId}>{children}</GroupItems>
			</CollapsiblePanel>
		</Collapsible>
	);
}

export type AppShellItemProps = Omit<
	Closed<useRender.ComponentProps<"a">>,
	"children" | "role"
> & {
	/** An icon, the label, then an optional Badge with a count. */
	children: ReactNode;
	/**
	 * Marks the current page. A router link that sets aria-current itself
	 * needs no prop.
	 */
	current?: boolean;
};

// Text joins one label that ends in an ellipsis when the sidebar is too
// narrow; the full text stays in the title and the accessible name.
function itemContent(children: ReactNode) {
	const output: ReactNode[] = [];
	let text = "";
	for (const child of Children.toArray(children)) {
		if (typeof child === "string" || typeof child === "number") {
			text += child;
		} else {
			if (text) {
				output.push(itemLabel(text, output.length));
				text = "";
			}
			output.push(child);
		}
	}
	if (text) {
		output.push(itemLabel(text, output.length));
	}
	return output;
}

function itemLabel(text: string, key: number) {
	return (
		<span key={`label-${key}`} title={text} {...props(styles.itemLabel)}>
			{text}
		</span>
	);
}

/** A link in the navigation. Render the router's link with render. */
export function AppShellItem({
	children,
	current,
	ref: forwardedRef,
	render,
	...rest
}: AppShellItemProps) {
	return useRender({
		defaultTagName: "a",
		props: mergeProps(
			rest,
			current === undefined
				? {}
				: { "aria-current": current ? ("page" as const) : undefined },
			props(styles.item, badgeFit.h32),
			{ children: itemContent(children), "data-slot": "app-shell-item" }
		),
		ref: forwardedRef,
		render: protectRenderSlot("app-shell-item", render),
	});
}

export type AppShellInsetProps = DivProps & { children: ReactNode };

/** The surface beside the sidebar: an AppShellHeader, then AppShellMain. */
export function AppShellInset({
	ref: forwardedRef,
	...rest
}: AppShellInsetProps) {
	return (
		<div
			{...rest}
			data-slot="app-shell-inset"
			ref={forwardedRef}
			{...props(styles.inset)}
		/>
	);
}

export type AppShellHeaderProps = Omit<
	Closed<ComponentPropsWithRef<"header">>,
	"role"
>;

/** The bar above the content: the sidebar trigger, the title, and actions. */
export function AppShellHeader({
	ref: forwardedRef,
	...rest
}: AppShellHeaderProps) {
	return (
		<header
			{...rest}
			data-slot="app-shell-header"
			ref={forwardedRef}
			{...props(styles.header)}
		/>
	);
}

export type AppShellTitleProps = Closed<useRender.ComponentProps<"div">>;

/**
 * The name of the current screen, on one line. It is not a heading: the
 * Page inside has the h1. Render an h1 when the screen has none.
 */
export function AppShellTitle({
	ref: forwardedRef,
	render,
	...rest
}: AppShellTitleProps) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps(rest, props(styles.title), {
			"data-slot": "app-shell-title",
		}),
		ref: forwardedRef,
		render: protectRenderSlot("app-shell-title", render),
	});
}

export type AppShellMainProps = Omit<
	Closed<ComponentPropsWithRef<"main">>,
	"id" | "role" | "tabIndex"
> & {
	/** Shows a line at the top while the next screen loads. */
	busy?: boolean;
	/** Read to screen readers while busy. */
	busyLabel?: string;
	children: ReactNode;
};

/** The scrolling content: put a Page inside. */
export function AppShellMain({
	busy = false,
	busyLabel = "Loading",
	children,
	ref: forwardedRef,
	...rest
}: AppShellMainProps) {
	const { mainId } = useShell("AppShellMain");
	return (
		<>
			<div data-slot="app-shell-busy" role="status" {...props(styles.busy)}>
				{busy ? (
					<>
						<span aria-hidden="true" {...props(styles.busyBar)} />
						<VisuallyHidden>{busyLabel}</VisuallyHidden>
					</>
				) : null}
			</div>
			<main
				{...rest}
				aria-busy={busy || undefined}
				data-slot="app-shell-main"
				id={mainId}
				ref={forwardedRef}
				tabIndex={-1}
				{...props(styles.main)}
			>
				{children}
			</main>
		</>
	);
}

export type AppShellSidebarTriggerProps = Omit<
	Closed<ComponentPropsWithRef<"button">>,
	"children" | "onClick" | "type"
> & {
	/** The accessible name. It also shows as the tooltip of an icon button. */
	"aria-label"?: string;
	/** The icon. The default is a sidebar glyph. */
	children?: ReactNode;
};

/**
 * Opens and closes the sidebar on a wide screen, and the navigation drawer
 * on a narrow one.
 */
export function AppShellSidebarTrigger({
	"aria-label": ariaLabel = "Toggle navigation",
	children,
	ref: forwardedRef,
	...rest
}: AppShellSidebarTriggerProps) {
	const { drawerOpen, open, setDrawerOpen, setOpen, wide } = useShell(
		"AppShellSidebarTrigger"
	);
	const toggle = useCallback(
		() => (wide ? setOpen(!open) : setDrawerOpen(true)),
		[open, setDrawerOpen, setOpen, wide]
	);
	return (
		<Button
			{...rest}
			aria-expanded={wide ? open : drawerOpen}
			aria-label={ariaLabel}
			onClick={toggle}
			ref={forwardedRef}
			size="icon-sm"
			variant="ghost"
		>
			{children ?? <SidebarGlyph collapse={wide && open} />}
		</Button>
	);
}

// Collapse while the sidebar is open beside the content; expand otherwise.
function SidebarGlyph({ collapse }: { collapse: boolean }) {
	const Glyph = collapse
		? IconLayoutSidebarLeftCollapse
		: IconLayoutSidebarLeftExpand;
	return <Glyph aria-hidden="true" size={16} />;
}
