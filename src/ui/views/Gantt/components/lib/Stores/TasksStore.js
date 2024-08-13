import { writable } from "svelte/store";

// function createTasks() {
// 	const { subscribe, update, set } = writable([]);

// 	return {
// 		subscribe,
// 		// addTask: () => update((n) => n.append("TEST")),
// 	};
// }

export let tasks = writable([]);
// export const tasks = createTasks();
