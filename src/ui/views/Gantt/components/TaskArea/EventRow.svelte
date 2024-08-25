<script lang="ts">
  //   import HBoxLayout from "../layout/HBoxLayout.svelte";
  import VBoxLayout from "../layout/VBoxLayout.svelte";
  import CellDragger from "./CellDragger.svelte";

  // try to give id for each "block" div equal to the date (use for loop starting to the currrent day), then style bloaks
  //   export let daysViewLength;
  import { daysViewLength_store } from "../stores/store";
  //   import { daysViewLength_store } from "stores";

  export let onNew: (start: Date, due: Date) => void;
</script>

<div class="vBoxLayout dragWrapper">
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
        <div class="block">
          <!-- {day} -->
          <CellDragger startIndex={day} onChange={onNew} />
        </div>
      {/each}
    </VBoxLayout>
    <!-- <div> -->
    <slot name="event" />
    <!-- <slot name="re" /> -->
    <!-- </div> -->
  </div>
</div>

<style>
  .dragWrapper {
    /* .dragDisable { */
    touch-action: none;
    /* outline: 1px red solid; */
  }
  .vBoxLayout {
    display: flex;
    flex-direction: row;
    min-width: fit-content;
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
    position: relative;
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
