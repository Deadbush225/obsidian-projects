<script>
	import TaskArea from "./TaskArea/TaskArea.svelte";
	import EventArea from "./EventArea.svelte";
    import VBoxLayout from "../widgets/VBoxLayout.svelte"
</script>


<!-- <div class="vBoxLayout"> -->
    <VBoxLayout>
        <TaskArea></TaskArea>
        <EventArea></EventArea>
        <!-- <EventArea --gt-row-height="1.3em"></EventArea> -->
    </VBoxLayout>
<!-- </div> -->

<style>
    :global(:root) {
        --gt-row-height: 1.3em
    }
</style>
