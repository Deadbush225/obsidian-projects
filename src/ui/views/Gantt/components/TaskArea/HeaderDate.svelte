<script lang="ts">
  //   import { type MonthBlock } from "../../types";
  import HBoxLayout from "../layout/HBoxLayout.svelte";
  import VBoxLayout from "../layout/VBoxLayout.svelte";
  import { monthBlocks_store } from "../stores/stores";
  //   import { daysPerMonth, monthFromIndex } from "../../constants";
  import { _range } from "./helper";
  //   import { get } from "svelte/store";

  //   export let monthBlocks; // use store instead of reactive values
  //   let monthBlocks: MonthBlock[] = get(monthBlocks_store); // use store instead of reactive values
  console.log("CONSTRUCTING HEADER");
  console.log($monthBlocks_store);

  //   $: monthBlocks;
  $: {
    console.log("TEST");
    console.log($monthBlocks_store);
  }
</script>

<VBoxLayout>
  <!-- {#if monthBlocks.length > 1} -->
  {#each $monthBlocks_store as month}
    <HBoxLayout className="monthBlock">
      <div class="monthYear">{month.monthYear}</div>
      <VBoxLayout id="events-header">
        {#each month.daysRange as day}
          <div class="date">{day}</div>
        {/each}
      </VBoxLayout>
    </HBoxLayout>
  {/each}
  <!-- {/if} -->
</VBoxLayout>

<style>
  :global(#events-header) {
    display: flex;
  }

  .date {
    display: block;
    min-width: 2em;
    text-align: center;
    border-bottom: 1px solid var(--background-modifier-border-focus);
  }

  .date:nth-child(2n + 1) {
    background-color: var(--background-secondary);
  }

  .monthYear {
    text-align: center;
  }

  :global(.monthBlock) {
    /* border-right: 1px solid var(--background-modifier-border-focus); */
    box-shadow: inset -0.5px 0px 0px 1px var(--background-modifier-border-focus);
  }
</style>
