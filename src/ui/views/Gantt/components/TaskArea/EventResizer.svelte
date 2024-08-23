<script lang="ts">
  // export let width: number;
  let width = 1;
  let min = 0;
  export let onChange: (change: number, field: string) => void;
  export let position: string;
  export let field: string;
  //   export let onFinalize: (width: number) => void;
  //   export let min: number;

  let start: number | null;
  let initial: number | null;
  let change: number;
  let delta: number;

  $: delta;

  function startResize(event: MouseEvent) {
    console.log("START DRAG");
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
      console.log("posting change");
      onChange(change, field);
    }
    start = null;
    initial = null;
    change = 0;
    delta = 0;
  }

  function resize(event: MouseEvent) {
    // console.log("RESIZE");
    // console.log(`${start} : ${initial}`);

    if (start && initial) {
      delta = event.pageX - start;

      //   const newWidth = initial + delta;

      //   if (newWidth >= min) {
      //   Math.sign();
      let isNegative = Math.sign(delta) == -1;
      let offset = 0;
      //   let offset = isNegative ? -1 : 0;
      //   console.log(`DELTA: ${delta} OFFSET: ${offset} IS BACK: ${delta >= -32}`);

      if (delta >= 32 || isNegative) {
        // console.log(`Q: ${delta / 32} CHANGE: ${Math.floor(delta / 32)}`);
        change = Math.floor(delta / 32) + offset;
        // console.log(newWidth);
        // onChange(Math.floor(delta / 32));

        // start = 0;
        // initial = null;
        //   } else if (delta >= -32) {
        //     change = Math.floor(delta / 32) - offset;
      }
      console.log(change);
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
  style="{position}: {delta * (position == 'right' ? -1 : 1)}px"
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
