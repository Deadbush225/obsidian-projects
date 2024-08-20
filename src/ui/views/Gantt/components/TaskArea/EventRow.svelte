<script>
  import HBoxLayout from "../layout/HBoxLayout.svelte";
  import VBoxLayout from "../layout/VBoxLayout.svelte";

  // try to give id for each "block" div equal to the date (use for loop starting to the currrent day), then style bloaks
  //   export let daysViewLength;
  import { daysViewLength_store } from "../stores/stores";
</script>

<VBoxLayout>
  <!-- <slot /> -->
  <!-- <VBoxLayout className="pinned"> -->
  <div class="pinned">
    <slot name="num" />
    <slot name="task" />
  </div>
  <!-- </VBoxLayout> -->
  <div class="event">
    <VBoxLayout>
      {#each { length: $daysViewLength_store } as _, day}
        <div class="block" />
      {/each}
    </VBoxLayout>
    <slot name="event" />
  </div>
</VBoxLayout>

<style>
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

  :global(.pinned) {
    /* width: 20vw; */
    /* min-width: 20vw; */
    /* text-overflow: clip;
    overflow: hidden;
    white-space: nowrap; */
    /* padding: 6px; */

    position: sticky;
    position: -webkit-sticky;
    left: 0;

    display: flex;

    /* background-color: var(--background-primary);
    border-right: 1px solid var(--background-modifier-border);
    border-left-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border); */
    z-index: 10;
    flex: 0 0 auto;
    /* background-color: red; */
  }
</style>
