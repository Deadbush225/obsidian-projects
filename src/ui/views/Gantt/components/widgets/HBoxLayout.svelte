<script>
    export let className="";
</script>

<style>
.hBoxLayout {
    display: flex;
    flex-direction: column;
}
</style>

<div class="hBoxLayout {className}">
    <slot></slot>
</div>