<script lang="ts">
  //   import { createEventDispatcher } from "svelte";
  import VBoxLayout from "../layout/VBoxLayout.svelte";
  import HeaderDate from "./HeaderDate.svelte";
  import Resizer from "../TaskArea/Resizer.svelte";
  import GridCell from "./GridCell.svelte";

  export let width: number;
  export let onColumnResize: (field: string, width: number) => void;
  export let handleFileDrop: (event: DragEvent) => void;
  //   const dispatch = createEventDispatcher();
  // addEventListener("dragover", (event) => {
  //   event.preventDefault();
  // });
  // addEventListener("drop", (event) => {
  //   console.log("DROP EVENT...");
  //   if (event instanceof DragEvent) {
  //     handleFileDrop(event);
  //   }
  // });
  //   function onResize();
</script>

<!-- <div class="header vBoxLayout"> -->
<VBoxLayout className="gantt-header">
  <VBoxLayout id="tasks-header">
    <GridCell {handleFileDrop}>
      <!-- trash icon here -->
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
        class="svg-icon lucide-trash-2"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0" />
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <g id="SVGRepo_iconCarrier">
          <path
            d="M3 6h18M9 6V4a2 2 0 0 1 4 0v2M4 6h16M4 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    </GridCell>
    <VBoxLayout
      style={`width: ${width}px`}
      className="flex-center-horizontally"
    >
      <div class="flex-center-vertically">Tasks</div>
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
    min-width: fit-content;
    /* height: 30px; */
  }

  :global(#tasks-header) {
    position: sticky;
    /* position: -webkit-sticky; */
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

  div {
    line-height: 2;
  }
</style>
