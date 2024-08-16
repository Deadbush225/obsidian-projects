<script>
  import VBoxLayout from "../layout/VBoxLayout.svelte";

  // try to give id for each "block" div equal to the date (use for loop starting to the currrent day), then style bloaks
  export let daysViewLength;
</script>

<VBoxLayout>
  <div class="task">
    <slot name="task" />
  </div>
  <div class="event">
    <VBoxLayout>
      {#each { length: daysViewLength } as _, day}
        <div class="block" />
      {/each}
    </VBoxLayout>
    <slot name="event" />
  </div>
</VBoxLayout>

<style>
  /* cant's style slots */
  .task {
    width: 20vw;
    min-width: 20vw;
    text-overflow: clip;
    overflow: hidden;
    white-space: nowrap;
    padding: 6px;

    position: sticky;
    left: 0;

    background-color: var(--background-primary);
    border-right: 1px solid var(--background-modifier-border);
    border-left-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);
    z-index: 10;
  }

  .event {
    position: relative;
    display: flex;
  }

  .block {
    border-right: 1px solid var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);
    min-width: 2em;
    min-height: 2em;
    /* aspect-ratio: 1 / 1; */
  }
</style>
