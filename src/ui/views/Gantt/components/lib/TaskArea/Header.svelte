<script>
  import { createEventDispatcher } from "svelte";
  import VBoxLayout from "../../widgets/VBoxLayout.svelte";

  const dispatch = createEventDispatcher();
</script>

<!-- <div class="header vBoxLayout"> -->
<VBoxLayout className="gantt-header">
  Tasks
  <button
    on:click={() => {
      dispatch("addTask");
    }}
    class="gt-addTask"
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
  </button>
</VBoxLayout>

<!-- </div> -->

<style>
  :global(.gantt-header) {
    position: relative;
    justify-content: center;
  }

  .gt-addTask {
    height: 10px;
    /* height: 100%; */
    aspect-ratio: 1/1;
    position: absolute;
    right: 0px;
  }
</style>
