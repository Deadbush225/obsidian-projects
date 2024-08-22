<script lang="ts">
  import EventResizer from "./EventResizer.svelte";
  import { daysFromNow } from "./helper";

  export let onChange: (change: number, field: str) => void;
  export let row: any;

  console.log(row);

  let distanceStartDate;
  let distanceDueDate;

  $: row;

  $: distanceStartDate = daysFromNow(row["start"]);
  $: distanceDueDate = daysFromNow(row["due"]);

  $: indent = row["start"] !== undefined ? distanceStartDate : 0;
  $: duration =
    row["due"] !== undefined ? distanceDueDate - distanceStartDate : 0;
</script>

<!-- slot="event" -->
<div class="event" style="left:{indent * 2}em; width:{duration * 2}em">
  <EventResizer field="start" {onChange} position="left" />
  <EventResizer field="due" {onChange} position="right" />
</div>

<style>
  .event {
    background-color: var(--color-purple);
    /* display: table-cell; */
    position: absolute;
    height: var(--gt-row-height);
    /* height: 1.3em;  */
    margin-top: 0.4em;
    text-align: center;
  }
</style>
