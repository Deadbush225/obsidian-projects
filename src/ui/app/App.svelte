<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import { createProject } from "src/lib/dataApi";
  import { api } from "src/lib/stores/api";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import { settings } from "src/lib/stores/settings";
  import { ViewApi } from "src/lib/viewApi";
  import { CreateProjectModal } from "src/ui/modals/createProjectModal";

  import Toolbar from "./toolbar/Toolbar.svelte";
  import { createDemoProject } from "./onboarding/demoProject";
  import { OnboardingModal } from "./onboarding/onboardingModal";
  import View from "./View.svelte";
  import DataFrameProvider from "./DataFrameProvider.svelte";
  import type { ProjectId, ViewId } from "src/settings/settings";

  // Use Obsidian's MarkdownRenderer, MarkdownView and TFile for rendering into a real view
  import { MarkdownRenderer, TFile, MarkdownView } from "obsidian";

  export let projectId: ProjectId | undefined;
  export let viewId: ViewId | undefined;

  $: ({ projects } = $settings);

  $: defaultProject = projects.find((project) => project.isDefault);

  $: project =
    projects.find((project) => projectId === project.id) ||
    defaultProject ||
    projects[0];

  $: views = project?.views || [];

  $: view = views.find((view) => viewId === view.id) || views[0];

  onMount(() => {
    if (!projects.length) {
      new OnboardingModal(
        $app,
        // Create from scratch.
        () => {
          new CreateProjectModal(
            $app,
            $i18n.t("modals.project.create.title"),
            $i18n.t("modals.project.create.cta"),
            settings.addProject,
            createProject()
          ).open();
        },
        // Try demo project.
        () => {
          createDemoProject($app.vault);
        }
      ).open();
    }
  });

  let previewEl: HTMLElement | null = null;
  let _previewClickHandler: ((e: MouseEvent) => void) | null = null;

  async function renderHomePreview() {
    const path = "home.md";
    let existing = $app.vault.getAbstractFileByPath(path);
    let file: TFile;
    if (!existing || !(existing instanceof TFile)) {
      file = await $app.vault.create(path, "# Home\n\nWelcome to your home note.");
    } else {
      file = existing as TFile;
    }

    const content = await $app.vault.read(file);

  if (!previewEl) return;

    // Use MarkdownRenderer with a MarkdownView context if available.
    try {
      // If we have a MarkdownView in the workspace, use it so links and embeds work.
      const activeMdView = $app.workspace.getActiveViewOfType(MarkdownView) as MarkdownView | null;
      await (MarkdownRenderer as any).render($app, content, previewEl, path, activeMdView || null);
    } catch (e) {
      // Fallback: render escaped content into previewEl
      previewEl.innerHTML = `<pre>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;
    }

    // Attach a delegated click handler so links work even if MarkdownRenderer
    // didn't wire up the component context. This handles both internal vault
    // links and external links.
    if (_previewClickHandler) previewEl.removeEventListener("click", _previewClickHandler);
    _previewClickHandler = function (ev: MouseEvent) {
      const target = ev.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || a.getAttribute("data-href") || a.getAttribute("data-path");
      if (!href) return;
      ev.preventDefault();
      // External link
      if (/^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("http")) {
        window.open(href, "_blank");
        return;
      }
      // Internal link: try to open via Obsidian workspace
      try {
        // openLinkText resolves internal wikilinks and file paths
        $app.workspace.openLinkText(href, "", true);
      } catch (err) {
        console.warn("Failed to open internal link", href, err);
      }
    };
    previewEl.addEventListener("click", _previewClickHandler);
  }

  onMount(() => {
    renderHomePreview();
  });

  onDestroy(() => {
    if (previewEl && _previewClickHandler) previewEl.removeEventListener("click", _previewClickHandler);
  });
</script>

<!--
	@component

	App is the main application component and coordinates between the View and
	the Toolbar.
-->
<div class="projects-container">
  <Toolbar
    {projects}
    projectId={project?.id}
    onProjectChange={(id) => (projectId = id)}
    viewId={view?.id}
    onViewChange={(id) => (viewId = id)}
  />

  <div class="projects-main">
    {#if project}
      <DataFrameProvider {project} let:frame let:source>
        {#if project && view && source}
          <View
            {project}
            {view}
            readonly={source.readonly()}
            api={new ViewApi(source, $api)}
            onConfigChange={settings.updateViewConfig}
            {frame}
          />
        {/if}
        <slot {project} {view} {source} {frame} />
      </DataFrameProvider>
    {/if}
  </div>
  <div class="home-note-preview">
    <div class="note-preview" data-path="home.md" bind:this={previewEl}></div>
  </div>
</div>

<style lang="scss">
  .projects-container {
    display: flex;
    flex-direction: column;
    /* height: 100%; */
    max-height: 90vh;
    overflow: hidden;

    .home-note-preview {
      height: 100%;
      overflow: scroll;
      padding: 1em 2em;
    }
  }

  .projects-main {
    /* flex: 1; */
    display: flex;
    flex-direction: column;
  }
</style>
