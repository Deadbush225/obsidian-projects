<script>
  import VBoxLayout from "../layout/VBoxLayout.svelte";
</script>

<VBoxLayout>
  <div class="task">
    <slot name="task" />
  </div>
  <div class="event">
    <slot name="event" />
  </div>
</VBoxLayout>

<style>
  /* cant's style slots */
  .task {
    width: 20vw;
    text-overflow: clip;
    overflow: hidden;
    white-space: nowrap;
    padding: 6px;

    position: sticky;
    left: 0;

    background-color: var(--background-primary);
    border-right: 1px solid var(--background-modifier-border);
    border-left-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);
    z-index: 10;
  }

  .event {
    position: relative;
  }
</style>
