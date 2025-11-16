<script lang="ts">
  export let handleFileDrop: (event: DragEvent) => void;

  let dragging = false;
</script>

<div
  class="flex-center-horizontally cell"
  on:dragenter|capture={() => (dragging = true)}
>
  {#if dragging}
    <div
      class="overlay"
      on:dragover|capture|preventDefault
      on:drop|capture={handleFileDrop}
      on:dragleave|capture={() => (dragging = false)}
    />
  {/if}
  <div class="flex-center-vertically">
    <slot />
  </div>
</div>

<style>
  .cell {
    /* background-color: var(--primary-background); */
    background-color: var(--background-secondary);
    border-right: 1px solid var(--background-modifier-border);
    border-left-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);

    width: 2.5em;
    flex: 0 0 auto;
    position: relative;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
</style>
