<script lang="ts">
  import {
    // DataFieldType,
    type DataFrame,
    type DataRecord,
  } from "src/lib/dataframe/dataframe";
  import { createDataRecord } from "src/lib/dataApi";
  //   import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import type { ViewApi } from "src/lib/viewApi";
  import { CreateNoteModal } from "src/ui/modals/createNoteModal";
  // import { EditNoteModal } from "src/ui/modals/editNoteModal";

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
  //   export let readonly: boolean;
  export let api: ViewApi;
  //   export let getRecordColor: (record: DataRecord) => string | null;

  export let config: GanttConfig | undefined;
  export let onConfigChange: (cfg: GanttConfig) => void;

  import Header from "./components/TaskArea/Header.svelte";
  import TextLabel from "./components/TaskArea/TextLabel.svelte";
  import EventRow from "./components/TaskArea/EventRow.svelte";
  import GridCell from "./components/TaskArea/GridCell.svelte";
  import GridRow from "./components/TaskArea/GridRow.svelte";
  import Event from "./components/TaskArea/Event.svelte";
  import { produce } from "immer";
  import { Button, Icon } from "obsidian-svelte";

  import { get } from "svelte/store";

  import { daysPerMonth, monthFromIndex } from "./constants";
  import { _range } from "./components/TaskArea/helper";
  import {
    monthBlocks_store,
    daysViewLength_store,
  } from "./components/stores/store";
  //   import { monthBlocks_store, daysViewLength_store } from "stores";

  export let rows;

  function saveConfig(cfg: GanttConfig) {
    config = cfg;
    onConfigChange(cfg);
  }

  //   type GridRowId = string;

  $: ({ fields, records } = frame);

  //   $: {
  //     console.log("Test");
  //     console.table(records);
  //     console.table(fields);
  //   }

  $: fieldConfig = config?.fieldConfig ?? {};

  $: rows = records.map<CustomGridRowProps>(({ id, values }) => ({
    rowId: id,
    row: values,
  }));

  $: width = fieldConfig["Tasks Column"]?.width ?? 200;

  let currentDate: Date = new Date();
  let daysViewLength: number = get(daysViewLength_store);

  let endDate: Date = currentDate;
  let monthBlocks: MonthBlock[] = get(monthBlocks_store);
  //   let isDragging: boolean = get(isDragging_store);

  //   $: {
  //     console.log("IS DRAGGING CHANGED");
  //     console.log(isDragging);
  //   }

  $: console.log(`${daysViewLength}, ${endDate}`);

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

  $: endDate;

  //   $: monthBlocks;

  //   $: daysViewLength;

  $: {
    // console.log("regenerating");
    monthBlocks = [];
    daysViewLength = 0;

    let pointer = new Date();

    let diffMonth = endDate.getMonth() - pointer.getMonth() + 1 + 1; // to make the end inclusive and empty buffer in the end
    let diffYear = (endDate.getFullYear() - pointer.getFullYear()) * 12;
    let diff = diffMonth + diffYear;

    // console.log(
    //   `${endDate.getMonth()} ${endDate.getFullYear()} - ${pointer.getMonth()} ${pointer.getFullYear()}`
    // );
    // console.log(diffMonth)
    // console.log(diff);

    let i = 0;

    // console.log(endDate);
    // console.log(diff);
    // if (diff == 1) {
    //   console.log("NO DUE PROVIDED");
    //   diff = 2;
    //   endDate = new Date();
    //   endDate.setDate(endDate.getDate() + 14);
    // }

    while (i < diff) {
      //   console.log(`${pointer.toDateString()} : ${endDate.toDateString()}`);
      //   if (pointer.getTime() >= endDate.getTime()) {
      //     console.log("BREAKING");
      //     break;
      //   }
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
    // console.log("CHECKING DATERANGE CHANGE");
    endDate = new Date();
    rows.forEach((row) => {
      //   console.log(row.row["due"]);
      if (!row.row["due"]) {
        return;
      }
      let rowDue: Date = new Date(row.row["due"]);
      //   if (!rowDue) {
      //     return;
      //   }

      if (rowDue.getTime() > endDate.getTime()) {
        // console.log("REPLACING");
        endDate = rowDue;
      }
      //   console.log(endDate);
      // let due = row.row["due"]
    });
  }

  $: {
    console.log("ROWS");
    console.log(rows);
  }
</script>

<ViewLayout>
  <ViewContent>
    <Header {width} onColumnResize={handleWidthChange} />
    {#each rows as { rowId, row }, i}
      <EventRow
        onNew={(start, due) => {
          const updatedValues = produce(row, (draft) => {
            draft["due"] = due;
            if (start) {
              draft["start"] = start;
            }
          });

          api.updateRecord(
            {
              id: rowId,
              values: updatedValues,
            },
            fields
          );
        }}
      >
        <GridCell slot="num">
          {i + 1}
        </GridCell>
        <div slot="task" class="task" style="width:{width + 1}px">
          <TextLabel value={rowId} sourcePath={row["name"]} richText={true} />
        </div>
        <Event
          slot="event"
          {row}
          onChange={(change, field) => {
            const updatedValues = produce(row, (draft) => {
              draft[field] = new Date(
                draft[field].setDate(draft[field].getDate() + change)
              );
            });

            api.updateRecord(
              {
                id: rowId,
                values: updatedValues,
              },
              fields
            );
          }}
        />
      </EventRow>
    {/each}
    <GridRow>
      <div style="padding: 4px;">
        <Button
          variant="plain"
          on:click={() => {
            new CreateNoteModal(
              $app,
              project,
              (name, templatePath, project) => {
                // console.log("ADDING RECORD");
                // console.log(name);
                // console.log(templatePath);
                // console.log(project);
                // console.table(fields);
                api.addRecord(
                  createDataRecord(name, project),
                  fields,
                  templatePath
                );
              }
            ).open();
          }}
        >
          <Icon name="plus" />
          <div>Add note</div>
        </Button>
      </div>
    </GridRow>
    <div class="endoccupant" />
  </ViewContent>
</ViewLayout>

<!-- </div> -->

<style>
  /* cant's style slots */
  .task {
    /* width: 20vw; */
    /* min-width: 20vw; */
    text-overflow: clip;
    overflow: hidden;
    white-space: nowrap;
    padding: 6px;

    /* position: sticky;
    left: 0; */

    background-color: var(--background-primary);
    border-right: 1px solid var(--background-modifier-border);
    border-left-color: var(--background-modifier-border);
    border-bottom: 1px solid var(--background-modifier-border);
    z-index: 10;
    /* background-color: red; */
    flex: 0 0 auto;
  }

  .endoccupant {
    width: 2em;
  }

  /* .dragWrapper { */
  /* position: relative; */
  /* touch-action: none; */
  /* } */

  /* div {
    display: flex;
  } */

  /* styled as a column header*/
  /* span {
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
  } */

  :global(:root) {
    --gt-row-height: 1.3em;
  }
</style>
