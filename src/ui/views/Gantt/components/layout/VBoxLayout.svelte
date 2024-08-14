<script>
  export let className = "";
  export let id = "";
</script>

<div class="vBoxLayout {className}" {id}>
  <slot />
</div>

<style>
  .vBoxLayout {
    display: flex;
    flex-direction: row;
  }
</style>
