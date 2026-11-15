---
"@mizen-labs/ui": minor
---

Add `AppShell`, the frame of an application (#5), from `@mizen-labs/ui` or `@mizen-labs/ui/app-shell`.

```tsx
<AppShell>
  <AppShellSidebar aria-label="Admin navigation">
    <AppShellSidebarHeader>…</AppShellSidebarHeader>
    <AppShellNav aria-label="Main">
      <AppShellGroup collapsible label="Finance">
        <AppShellItem render={<Link to="/balances" />}>
          <IconWallet aria-hidden="true" />
          Balances
        </AppShellItem>
      </AppShellGroup>
    </AppShellNav>
    <AppShellSidebarFooter>…</AppShellSidebarFooter>
  </AppShellSidebar>
  <AppShellInset>
    <AppShellHeader>
      <AppShellSidebarTrigger />
      <AppShellTitle>Balances</AppShellTitle>
    </AppShellHeader>
    <AppShellMain>
      <Page>…</Page>
    </AppShellMain>
  </AppShellInset>
</AppShell>
```

- From 48rem the sidebar sits beside one inset surface. The navigation scrolls; the sidebar header and footer stay in view.
- `AppShellSidebarTrigger` collapses the sidebar, and its icon shows whether it will collapse or expand. Collapsed, the sidebar hides at once and slides back over the content while the pointer rests on the left edge, and while focus or an open menu is inside it. It stays above anything raised in the content, such as a sticky table header.
- Below 48rem the same sidebar opens in a left drawer, which closes after a link is chosen.
- `AppShellItem` renders a router link, marks the current page from `current` or the link's own `aria-current`, truncates a long label and keeps its full text, and fits a `Badge` count.
- `AppShellGroup` lists its items under a label and can fold, controlled or not.
- `sidebarOpen` and `onSidebarOpenChange` let the app save the state. `AppShellMain busy` shows a loading line with a status for screen readers.
- A skip link moves focus to the content.

The app owns routes, permissions and saved preferences. English names (`skipLinkLabel`, `busyLabel`, `closeLabel`, the trigger's `aria-label`) are props.
