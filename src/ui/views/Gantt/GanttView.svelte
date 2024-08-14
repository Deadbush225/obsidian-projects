<script lang="ts">
  import {
    DataFieldType,
    type DataFrame,
    type DataRecord,
  } from "src/lib/dataframe/dataframe";
  //   import { createDataRecord } from "src/lib/dataApi";
  import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import type { ViewApi } from "src/lib/viewApi";
  //   import { CreateNoteModal } from "src/ui/modals/createNoteModal";
  //   import { EditNoteModal } from "src/ui/modals/editNoteModal";

  import type {
    GridColDef,
    GridRowProps,
  } from "./components/DataGrid/dataGrid";
  //   import DataGrid from "./components/DataGrid/DataGrid.svelte";
  import SwitchSelect from "./components/SwitchSelect/SwitchSelect.svelte";
  import type { TableConfig } from "./types";

  import {
    ViewContent,
    ViewHeader,
    ViewLayout,
    ViewToolbar,
  } from "src/ui/components/Layout";
  //   import { ConfigureFieldModal } from "src/ui/modals/configureField";
  import { settings } from "src/lib/stores/settings";
  import { sortFields } from "./helpers";
  import type { ProjectDefinition } from "src/settings/settings";
  import { CreateFieldModal } from "src/ui/modals/createFieldModal";
  //   import { Icon } from "obsidian-svelte";
  //   import { TextLabel } from "./components/DataGrid/GridCell/GridTextCell";
  import { fieldIcon } from "../helpers";

  export let project: ProjectDefinition;
  export let frame: DataFrame;
  export let readonly: boolean;
  export let api: ViewApi;
  export let getRecordColor: (record: DataRecord) => string | null;

  export let config: TableConfig | undefined;
  export let onConfigChange: (cfg: TableConfig) => void;

  import Header from "./components/TaskArea/Header.svelte";
  //   import TaskArea from "./components/TaskArea/TaskArea.svelte";
  //   import EventArea from "./components/EventArea.svelte";
  import HBoxLayout from "./components/layout/HBoxLayout.svelte";
  import VBoxLayout from "./components/layout/VBoxLayout.svelte";
  import InternalLink from "src/ui/components/InternalLink.svelte";
  import TextLabel from "./components/TaskArea/TextLabel.svelte";
  import EventRow from "./components/TaskArea/EventRow.svelte";

  export let rows;

  let buttonEl: HTMLElement;

  function saveConfig(cfg: TableConfig) {
    config = cfg;
    onConfigChange(cfg);
  }

  export function getFieldTypeByName(name: string): DataFieldType | undefined {
    const field = fields.find((field) => name === field.name);
    return field?.type;
  }

  type GridRowId = string;

  $: ({ fields, records } = frame);

  $: rows = records.map<CustomGridRowProps>(({ id, values }) => ({
    rowId: id,
    row: values,
  }));
  $: console.log(rows);

  //   $: {
  //     fields = sortFields(fields, config?.orderFields ?? []);
  //   }

  //   $: fieldConfig = config?.fieldConfig ?? {};

  //   $: columns = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

  //   $: rows = records.map<GridRowProps>(({ id, values }) => ({
  //     rowId: id,
  //     row: values,
  //   }));
</script>

<ViewLayout>
  <ViewHeader>
    <ViewToolbar variant="secondary">
      <svelte:fragment slot="right">
        <!-- <SwitchSelect
          label={$i18n.t("views.table.hide-fields")}
          items={columns.map((column) => ({
            label: column.field,
            icon: fieldIcon(column),
            value: column.field,
            enabled: !column.hide,
          }))}
          onChange={handleVisibilityChange}
        /> -->
      </svelte:fragment>
    </ViewToolbar>
  </ViewHeader>
  <ViewContent>
    <!-- <div class="vBoxLayout"> -->
    <Header />
    {#each rows as val, i}
      <EventRow>
        <TextLabel
          slot="task"
          value={val.rowId}
          sourcePath={val.row["name"]}
          richText={true}
        />
        <div
          slot="event"
          class="event"
          style="left:{Math.floor(Math.random() * 30) * 2}em; width:6em"
        />
      </EventRow>
    {/each}
    <!-- <HBoxLayout> -->
    <!-- {console.log("========")} -->
    <!-- {console.log(val)} -->
    <!-- <a class="row" href={val.row.name}>{val.row.name}</a> -->
    <!-- <div class="row">{val.row["name"]}</div> -->
    <!-- <InternalLink /> -->
    <!-- </HBoxLayout> -->
    <!-- <TaskArea /> -->
    <!-- <EventArea /> -->
    <!-- <EventArea --gt-row-height="1.3em"></EventArea> -->
    <!-- </div> -->
  </ViewContent>
</ViewLayout>

<style>
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
