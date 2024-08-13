<script>
	// import { writable } from "svelte/store";

	import Header from "./Header.svelte";
	import { tasks } from "../Stores/TasksStore.js";
    import HBoxLayout from "../../widgets/HBoxLayout.svelte";

	// /**
	//  * @type {Writable<never[]>}
	//  */
	// let tasks = writable([]);

	let rand = Math.random;

	function addTask() {
		$tasks = [...$tasks, { name: "test", top: $tasks.length * 2.05 }];
	}
</script>

<!-- <div class="hBoxLayout"> -->
 <HBoxLayout>

     <Header on:addTask={addTask}></Header>
     <div class="task-column">
         {#each $tasks as task, i}
         <div class="gt-task">task {i + 1}</div>
         <!-- <div class="gt-task">task 1</div> -->
         {/each}
        </div>
    </HBoxLayout>
    <!-- </div> -->

<style>
	.task-column {
		width: 20vw;
		min-height: 50vh;
		border: 1px solid black;
	}

	.gt-task {
		height: var(--gt-row-height);
		background-color: blueviolet;
		border-radius: 0.25em;
		margin: 0.125em;
		margin-bottom: 0.25em;
		padding: 0.15em 0 0.35em;
	}
</style>
