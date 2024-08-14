<script>
  export let className = "";
  export let id = "";
</script>

<div class="hBoxLayout {className}" {id}>
  <slot />
</div>

<style>
  .hBoxLayout {
    display: flex;
    flex-direction: column;
  }
</style>
