<script>
</script>

<div class="gt-grid-row">
  <slot />
</div>

<style>
  .gt-grid-row {
    display: flex;
    width: 100%;

    /* background-color: var(--primary-background); */
    background-color: var(--background-secondary);
    border-right: 1px solid var(--background-modifier-border);
    border-left-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);

    position: sticky;
    left: 0;
  }
</style>
