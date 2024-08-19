<script lang="ts">
  import {
    DataFieldType,
    type DataFrame,
    type DataRecord,
  } from "src/lib/dataframe/dataframe";
  //   import { createDataRecord } from "src/lib/dataApi";
  //   import { i18n } from "src/lib/stores/i18n";
  //   import { app } from "src/lib/stores/obsidian";
  import type { ViewApi } from "src/lib/viewApi";
  //   import { CreateNoteModal } from "src/ui/modals/createNoteModal";
  //   import { EditNoteModal } from "src/ui/modals/editNoteModal";

  //   import type {
  //     GridColDef,
  //     GridRowProps,
  //   } from "./components/DataGrid/dataGrid";
  //   import DataGrid from "./components/DataGrid/DataGrid.svelte";
  //   import SwitchSelect from "./components/SwitchSelect/SwitchSelect.svelte";
  import type { CustomGridRowProps, MonthBlock, GanttConfig } from "./types";

  import {
    ViewContent,
    // ViewHeader,
    ViewLayout,
    // ViewToolbar,
  } from "src/ui/components/Layout";
  //   import { ConfigureFieldModal } from "src/ui/modals/configureField";
  //   import { settings } from "src/lib/stores/settings";
  //   import { sortFields } from "./helpers";
  import type { ProjectDefinition } from "src/settings/settings";
  //   import { CreateFieldModal } from "src/ui/modals/createFieldModal";
  //   import { Icon } from "obsidian-svelte";
  //   import { TextLabel } from "./components/DataGrid/GridCell/GridTextCell";
  //   import { fieldIcon } from "../helpers";

  export let project: ProjectDefinition;
  export let frame: DataFrame;
  export let readonly: boolean;
  export let api: ViewApi;
  export let getRecordColor: (record: DataRecord) => string | null;

  export let config: GanttConfig | undefined;
  export let onConfigChange: (cfg: GanttConfig) => void;

  import Header from "./components/TaskArea/Header.svelte";
  //   import TaskArea from "./components/TaskArea/TaskArea.svelte";
  //   import EventArea from "./components/EventArea.svelte";
  //   import HBoxLayout from "./components/layout/HBoxLayout.svelte";
  //   import VBoxLayout from "./components/layout/VBoxLayout.svelte";
  //   import InternalLink from "src/ui/components/InternalLink.svelte";
  import TextLabel from "./components/TaskArea/TextLabel.svelte";
  import EventRow from "./components/TaskArea/EventRow.svelte";

  import { get } from "svelte/store";

  import { daysPerMonth, monthFromIndex } from "./constants";
  import { _range, daysFromNow } from "./components/TaskArea/helper";
  import {
    monthBlocks_store,
    daysViewLength_store,
  } from "./components/stores/stores";

  export let rows;

  function saveConfig(cfg: GanttConfig) {
    config = cfg;
    onConfigChange(cfg);
  }

  //   type GridRowId = string;

  $: ({ fields, records } = frame);

  $: fieldConfig = config?.fieldConfig ?? {};

  $: rows = records.map<CustomGridRowProps>(({ id, values }) => ({
    rowId: id,
    row: values,
  }));

  $: width = fieldConfig["Tasks Column"]?.width ?? 200;
  $: {
    console.log(width);
    console.log(fields);
  }

  let currentDate: Date = new Date();
  //   let daysViewLength = 0;
  let daysViewLength = get(daysViewLength_store);

  let endDate: Date = currentDate;
  let monthBlocks: MonthBlock[] = get(monthBlocks_store);
  //   let currentDay: number = currentDate.getDate();
  let currentYear: number = currentDate.getFullYear();

  function handleWidthChange(field: string = "Tasks Column", width: number) {
    saveConfig({
      ...config,
      fieldConfig: {
        ...fieldConfig,
        [field]: {
          ...fieldConfig[field],
          width,
        },
      },
    });
  }
  //   let endDate: Date = new Date();
  //   endDate.setDate(currentDate.getDate() + 70);

  $: endDate;

  //   $: monthBlocks;

  //   $: daysViewLength;

  $: {
    monthBlocks = [];
    daysViewLength = 0;

    let pointer = new Date();

    let diffMonth = endDate.getMonth() - pointer.getMonth() + 1; // to make the end inclusive
    let diffYear = (endDate.getFullYear() - pointer.getFullYear()) * 12;
    let diff = diffMonth + diffYear;

    // console.log(
    //   `${endDate.getMonth()} ${endDate.getFullYear()} - ${pointer.getMonth()} ${pointer.getFullYear()}`
    // );
    // console.log(diffMonth);
    // console.log(diff);

    let i = 0;
    while (i < diff) {
      if (pointer.getTime() >= endDate.getTime()) {
        break;
      }
      let currentMonth: number = pointer.getMonth();
      let currentYear: number = pointer.getFullYear();

      let monthYear: string = `${monthFromIndex(currentMonth)} ${currentYear}`;
      let days: number[] = _range(
        pointer.getDate(),
        daysPerMonth(currentMonth, currentYear)
      );

      daysViewLength += days.length;
      let block: MonthBlock = { monthYear: monthYear, daysRange: days };
      monthBlocks.push(block);

      //   console.log("MONTHBLOCK");
      //   console.log(monthBlocks);

      // increase month by 1
      let month = pointer.getMonth();
      if (month == 12) {
        pointer.setFullYear(pointer.getFullYear() + 1);
        pointer.setMonth(0);
      } else {
        pointer.setMonth(month + 1);
      }
      //   console.log("RESETING DATE");
      pointer.setDate(1);

      monthBlocks_store.set(monthBlocks);
      daysViewLength_store.set(daysViewLength);

      ++i;
    }
    // console.log("MATCH");
  }

  $: {
    endDate = new Date();
    rows.forEach((row) => {
      let rowDue: Date = row.row["due"];
      if (!rowDue) {
        return;
      }

      if (rowDue.getTime() > endDate.getTime()) {
        // console.log("REPLACING");
        endDate = rowDue;
      }
      //   console.log(endDate);
      // let due = row.row["due"]
    });
  }
</script>

<ViewLayout>
  <ViewContent>
    <!-- <div class="vBoxLayout"> -->
    <Header {width} onColumnResize={handleWidthChange} />
    {#each rows as val, i}
      <!-- <EventRow {daysViewLength}> -->
      <EventRow>
        <div
          style={`width: ${width}px; flex: 0 0 auto`}
          slot="task"
          class="task"
        >
          <TextLabel
            value={val.rowId}
            sourcePath={val.row["name"]}
            richText={true}
          />
        </div>

        <!-- {#if val.row["due"] !== undefined} -->
        <div
          slot="event"
          class="event"
          style="left:{(val.row['start'] !== undefined
            ? daysFromNow(val.row['start'])
            : 0) * 2}em; width:{(val.row['due'] !== undefined
            ? daysFromNow(val.row['due'])
            : 0) * 2}em"
        />
        <!-- {/if} -->
      </EventRow>
    {/each}
  </ViewContent>
</ViewLayout>

<style>
  /* cant's style slots */
  .task {
    /* width: 20vw; */
    /* min-width: 20vw; */
    text-overflow: clip;
    overflow: hidden;
    white-space: nowrap;
    padding: 6px;

    position: sticky;
    left: 0;

    background-color: var(--background-primary);
    border-right: 1px solid var(--background-modifier-border);
    border-left-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);
    z-index: 10;
    /* background-color: red; */
  }

  /* div {
    display: flex;
  } */
  .event {
    background-color: red;
    /* display: table-cell; */
    position: absolute;
    height: var(--gt-row-height);
    /* height: 1.3em;  */
    margin-top: 0.4em;
    text-align: center;
  }

  /* styled as a column header*/
  span {
    position: sticky;
    top: 0;
    z-index: 6;

    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;

    background-color: var(--background-secondary);
    border-right: 1px solid var(--background-modifier-border);
    border-left-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);

    height: fit-content;
    min-height: 30px;

    color: var(--text-muted);
    font-weight: 500;
    padding: 0 12px;

    cursor: default;
  }

  span:focus {
    border-radius: var(--button-radius);
    box-shadow: 0 0 0 2px var(--background-modifier-border-focus);
  }

  span:hover {
    color: var(--text-normal);
  }

  :global(:root) {
    --gt-row-height: 1.3em;
  }
</style>
