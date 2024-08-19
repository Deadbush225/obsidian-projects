<script>
  export let className = "";
  export let id = "";
  export let style = "";
</script>

<div class="vBoxLayout {className}" {id} {style}>
  <slot />
</div>

<style>
  .vBoxLayout {
    display: flex;
    flex-direction: row;
  }
</style>
