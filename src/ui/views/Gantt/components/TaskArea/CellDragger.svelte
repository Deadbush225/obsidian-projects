<script lang="ts">
  // export let width: number;
  let width = 1;
  let min = 0;
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

  function startResize(event: MouseEvent) {
    // console.log("CELL DRAGGER");
    // Unless we stop propagation, resizing will also drag the column.
    event.stopPropagation();

    start = event.pageX;
    initial = width;
  }

  function stopResize(event: MouseEvent) {
    // console.log("STOPPING RESIZE");
    // console.log(`${start} : ${initial}`);
    // if (start && initial) {
    //   const delta = event.pageX - start;
    //   //   const newWidth = initial + delta;

    //   if (Math.abs(delta) >= 32) {
    //     //   if (newWidth >= min) {
    //     // console.log(Math.floor(delta / 32));
    //     // onFinalize(newWidth); //<- dapat onFinalize
    //     // onChange(Math.floor(delta / 32));
    //     // onFinalize(width);
    //     change = Math.floor(delta / 32);
    //     console.log(change);
    //     onChange(change);
    //     //   }
    //     // }
    //   }
    //   //   initial = null;
    // }
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

  function resize(event: MouseEvent) {
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
      // console.log(newWidth);
      // onChange(Math.floor(delta / 32));

      // start = 0;
      // initial = null;
      //   } else if (delta >= -32) {
      //     change = Math.floor(delta / 32) - offset;
      //   }
      //   console.log(change);
      //   current = event.pageX;
      //   console.log(current);
      //   console.log(start);
    }
  }
</script>

<svelte:window on:mouseup={stopResize} on:mousemove={resize} />
<!-- <div class="temp event" style="width: {change * 2}em;" /> -->
<span
  class="handle"
  class:visible={start}
  style="left: {delta}px;"
  on:mousedown={startResize}
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
