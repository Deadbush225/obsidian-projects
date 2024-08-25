<script lang="ts">
  import { isDragging_store } from "../stores/store";

  // export let width: number;
  let width = 1;
  //   let min = 0;
  export let onChange: (start: Date, due: Date) => void;
  export let startIndex: number;
  //   export let onFinalize: (width: number) => void;
  //   export let min: number;

  let start: number | null;
  let initial: number | null;
  let change: number;
  let delta: number;
  let isNegative: boolean;

  $: delta = -3;

  function startResize(event: MouseEvent | TouchEvent) {
    // console.log("CELL DRAGGER");

    // console.log($isDragging_store);
    isDragging_store.set(true);
    // Unless we stop propagation, resizing will also drag the column.
    event.stopPropagation();
    // console.log(event.touches[0].pageX);

    if (event instanceof TouchEvent) {
      console.log("IT IS TOUCH");
      event = event.touches[0];
    }

    start = event.pageX;
    initial = width;
    console.log(start);
  }

  function stopResize(event: MouseEvent | TouchEvent) {
    // event.stopPropagation();
    // event.stopImmediatePropagation();

    // console.log("STOPPING");
    // console.log($isDragging_store);
    isDragging_store.set(false);
    if (event instanceof TouchEvent) {
      //   event: Touch = event;
      event = event.touches[0];
    }

    if (start && initial) {
      //   console.log("posting change");

      let startDate = new Date();
      startDate.setDate(
        startDate.getDate() + startIndex + (isNegative ? change : 0)
      );
      //   console.log(
      //     `${startDate.getDate()} + ${startIndex} + ${isNegative ? change : 0}`
      //   );

      let dueDate = new Date();
      dueDate.setDate(
        dueDate.getDate() + startIndex + (isNegative ? 0 : change)
      );
      //   console.log(
      //     `${dueDate.getDate()} + ${startIndex} + ${
      //       isNegative ? -1 * change : change
      //     }`
      //   );

      onChange(startDate, dueDate);
    }
    start = null;
    initial = null;
    change = 0;
    delta = -3;
  }

  function resize(event: MouseEvent | TouchEvent) {
    if (event instanceof TouchEvent) {
      //   event: Touch = event;

      event = event.touches[0];
    }
    // console.log("RESIZE");
    // console.log(`${start} : ${initial}`);

    if (start && initial) {
      delta = event.pageX - start;

      //   const newWidth = initial + delta;

      //   if (newWidth >= min) {
      //   Math.sign();
      isNegative = Math.sign(delta) == -1;
      //   let offset = 0;
      let offset = isNegative ? 0 : 1;
      //   console.log(`DELTA: ${delta} OFFSET: ${offset} IS BACK: ${delta >= -32}`);

      //   if (delta >= 32 || isNegative) {
      // console.log(`Q: ${delta / 32} CHANGE: ${Math.floor(delta / 32)}`);
      change = Math.floor(delta / 32) + offset;
      console.log(change);
    }
  }

  //   function touchResize(event: TouchEvent) {
  //     if (event === undefined) {
  //       return;
  //     }

  //     resize(event.touches[0]!);
  //   }

  //   function touchStartResize(event: TouchEvent) {
  //     console.log("STARTING RESIZE");
  //     if (event === undefined) {
  //       return;
  //     }

  //     startResize(event.touches[0]!);
  //   }
  //   function touchStopResize(event: TouchEvent) {
  //     if (event === undefined) {
  //       return;
  //     }

  //     stopResize(event.touches[0]!);
  //   }
</script>

<svelte:window on:mouseup={stopResize} on:mousemove={resize} />
<!-- <div class="temp event" style="width: {change * 2}em;" /> -->
<span
  class="handle"
  class:visible={start}
  style="left: {delta}px;"
  on:mousedown={startResize}
  on:touchend={stopResize}
  on:touchmove={resize}
  on:touchstart={startResize}
/>

<style>
  .handle {
    position: absolute;
    width: 6px;
    min-width: 6px;
    height: 100%;
    border-radius: 1px;
    z-index: 1;
  }
  .handle:hover {
    background-color: var(--interactive-accent);
    cursor: ew-resize;
  }
  .visible {
    background-color: var(--interactive-accent);
    cursor: ew-resize;
  }
</style>
