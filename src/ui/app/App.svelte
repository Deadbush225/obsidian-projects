<script lang="ts">
  import { onMount } from "svelte";

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

  // Use Obsidian's MarkdownRenderer and TFile for type assertions
  import { MarkdownRenderer, TFile } from "obsidian";

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
    {#await (async () => {
      const path = "home.md";
      // getAbstractFileByPath returns a TAbstractFile; narrow to TFile where needed
      let existing = $app.vault.getAbstractFileByPath(path);
      let file;
      if (!existing || !(existing instanceof TFile)) {
        file = await $app.vault.create(path, "# Home\n\nWelcome to your home note.");
      } else {
        file = existing;
      }

      const content = await $app.vault.read(file);
      console.log("Content:", content);

      // Render markdown to HTML using Obsidian's MarkdownRenderer,
      // otherwise fall back to escaped plain text.
      const container = document.createElement("div");
      try {
        // MarkdownRenderer.render returns a Promise<void>
        await MarkdownRenderer.render($app, content, container, path, null);
        return container.innerHTML;
      } catch (e) {
        // ignore and fall back to plain text
      }
      return `<pre>${content
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</pre>`;
    })() then html}
      <div class="note-preview" data-path="home.md">
        {@html html}
      </div>
    {/await}
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
