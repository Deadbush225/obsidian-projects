import { writable } from "svelte/store";
import { MonthBlock } from "../../types";

export const monthBlocks_store = writable<MonthBlock[]>([]);
export const daysViewLength_store = writable(0);
export const isDragging_store = writable(false);
