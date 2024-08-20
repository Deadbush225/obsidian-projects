<script>
  export let className = "";
  export let id = "";
  export let style = "";
</script>

<div class="hBoxLayout {className}" {id} {style}>
  <slot />
</div>

<style>
  .hBoxLayout {
    display: flex;
    flex-direction: column;
  }
</style>
