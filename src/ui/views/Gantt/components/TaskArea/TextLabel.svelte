<script lang="ts">
  import { MarkdownRenderer } from "obsidian";
  import { app, view } from "src/lib/stores/obsidian";
  import { handleHoverLink } from "src/ui/views/helpers";
  //   import { getContext } from "svelte";

  export let value: string;
  export let richText: boolean = false;
  export let sourcePath: string;
  export let style: string = "";
  console.log("V: " + value);
  console.log("S: " + sourcePath);

  //   const sourcePath = getContext<string>("sourcePath") ?? "";
  //   console.log(`VALUE : ${value}`);
  //   console.log(`SOURCE PATH : ${sourcePath}`);

  function useMarkdown(node: HTMLElement, value: string) {
    // MarkdownRenderer.render($app, value, node, sourcePath, $view);

    // console.log(`${value}, ${sourcePath}`);
    MarkdownRenderer.render($app, sourcePath, node, value, $view);

    return {
      update(newValue: string) {
        node.empty();
        // MarkdownRenderer.render($app, newValue, node, sourcePath, $view);
        // console.log(`${value}, ${sourcePath}`);
        MarkdownRenderer.render($app, sourcePath, node, newValue, $view);
      },
    };
  }

  function handleClick(event: MouseEvent) {
    const targetEl = event.target as HTMLElement;
    const closestAnchor =
      targetEl.tagName === "A" ? targetEl : targetEl.closest("a");

    if (!closestAnchor) {
      return;
    }

    if (closestAnchor.hasClass("internal-link")) {
      event.preventDefault();

      const href = closestAnchor.getAttr("href");
      const newLeaf = event.button === 1 || event.ctrlKey || event.metaKey;

      if (href) {
        $app.workspace.openLinkText(href, sourcePath, newLeaf);
      }
    }
  }
</script>

{#if richText}
  <div
    use:useMarkdown={value}
    on:click={handleClick}
    on:mouseover={(event) => {
      handleHoverLink(event, sourcePath);
    }}
    on:focus
    on:keypress
    {style}
  />
{:else}
  <div>
    {value}
  </div>
{/if}

<style>
  /* div {
    padding: 6px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  } */

  div :global(p:first-child) {
    margin-top: 0;
  }

  div :global(p:last-child) {
    margin-bottom: 0;
  }
</style>
