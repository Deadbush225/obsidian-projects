<script>
    export let className="";
</script>

<style>
    .vBoxLayout {
    display: flex;
    flex-direction: row;
}
</style>

<div class="vBoxLayout {className}" >
    <slot></slot>
</div>