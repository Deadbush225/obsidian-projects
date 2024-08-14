<script lang="ts">
  // import { writable } from "svelte/store";

  //   import { tasks } from "./Stores/TasksStore.js";
  import HBoxLayout from "./layout/HBoxLayout.svelte";

  // let events = writable([]);

  // export function addEvent() {
  // 	$events = [...$events, { text: "EVENT", height: 2 * 3 + "em" }];
  // }
</script>

<!-- <div class="hBoxLayout event-area"> -->
<!-- <div class="event-area"> -->
<HBoxLayout className="event-area">
  <div class="event-graph">
    <!-- {#each $tasks as task}
      <div
        class="event"
        style="left:{task.left}em; top:{task.top}em; width:6em"
      >
        {task.name}
      </div>
    {/each} -->
  </div>
</HBoxLayout>

<!-- </div> -->

<style>
  .event {
    background-color: red;
    /* display: table-cell; */
    position: absolute;
    height: var(--gt-row-height);
    /* height: 1.3em;  */
    margin-top: 0.4em;
    text-align: center;
  }

  .header {
    display: flex;
  }

  .event-area {
    flex-grow: 10;
    overflow-x: scroll;
  }

  .event-graph {
    min-width: 20vw;
    width: 100%;
    min-height: 50vh;
    height: 100vw;
    position: relative;
    /* overflow-y: hidden; */
    /* border: solid 1px black; */
  }
  .event-graph:last-child {
    margin-bottom: 100px;
  }
</style>
