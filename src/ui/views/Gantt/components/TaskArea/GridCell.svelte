<script>
</script>

<div class="flex-center-horizontally cell">
  <div class="flex-center-vertically">
    <slot />
  </div>
</div>

<style>
  .cell {
    /* background-color: var(--primary-background); */
    background-color: var(--background-secondary);
    border-right: 1px solid var(--background-modifier-border);
    border-left-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);

    width: 2.5em;
    flex: 0 0 auto;
  }
</style>
