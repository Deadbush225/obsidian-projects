<script lang="ts">
  //   import { createEventDispatcher } from "svelte";
  import VBoxLayout from "../layout/VBoxLayout.svelte";
  import HeaderDate from "./HeaderDate.svelte";
  import Resizer from "../TaskArea/Resizer.svelte";
  import GridCell from "./GridCell.svelte";

  export let width: number;
  export let onColumnResize: (field: string, width: number) => void;

  //   const dispatch = createEventDispatcher();

  //   function onResize();
</script>

<!-- <div class="header vBoxLayout"> -->
<VBoxLayout className="gantt-header">
  <VBoxLayout id="tasks-header">
    <GridCell />
    <VBoxLayout
      style={`width: ${width}px`}
      className="flex-center-horizontally"
    >
      <div class="flex-center-vertically">Tasks</div>
      <!-- <div
        on:click={() => {
          dispatch("addTask");
        }}
        class="gt-addTask clickable-icon"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="svg-icon lucide-palette"
          ><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          /><g id="SVGRepo_iconCarrier">
            <path
              d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g></svg
        >
      </div> -->
    </VBoxLayout>
    <Resizer
      {width}
      min={100}
      onChange={(width) => {
        onColumnResize("Tasks Column", width);
        // onResize("Tasks Column", width);
      }}
      onFinalize={(width) => {
        onColumnResize("Tasks Column", width);
        // onFinalizeResize("Tasks Column", width);
      }}
    />
  </VBoxLayout>
  <HeaderDate />
</VBoxLayout>

<!-- </div> -->

<style>
  :global(.flex-center-horizontally) {
    display: flex;
    justify-content: center;
  }

  :global(.flex-center-vertically) {
    flex-wrap: wrap;
    display: flex;
    align-content: center;
  }

  :global(.gantt-header) {
    /* height: 30px; */
  }

  :global(#tasks-header) {
    position: sticky;
    position: -webkit-sticky;
    left: 0;
    justify-content: center;
    /* width: 20vw;
    min-width: 20vw; */
    /* border: 1px solid black; */

    background-color: var(--background-secondary);
    border-right: 1px solid var(--background-modifier-border-focus);
    border-bottom: 1px solid var(--background-modifier-border-focus);
    z-index: 4;
  }

  :global(#events-header) {
    display: flex;
  }

  .gt-addTask {
    /* height: 10px; */
    /* height: 100%; */
    aspect-ratio: 1/1;
    position: absolute;
    right: 0px;
  }

  div {
    line-height: 2;
  }
</style>
