<script lang="ts">
  import { TFolder } from "obsidian";

  import type { DataFrame, DataValue } from "src/lib/dataframe/dataframe";
  import { createDataRecord } from "src/lib/dataApi";
  //   import { i18n } from "src/lib/stores/i18n";
  import { app } from "src/lib/stores/obsidian";
  import type { ViewApi } from "src/lib/viewApi";
  import { CreateNoteModal } from "src/ui/modals/createNoteModal";

  import type { CustomGridRowProps, MonthBlock, GanttConfig } from "./types";

  import { ViewContent, ViewLayout } from "src/ui/components/Layout";
  import type { ProjectDefinition } from "src/settings/settings";

  export let project: ProjectDefinition;
  export let frame: DataFrame;
  export let api: ViewApi;

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
  import { Optional } from "obsidian-projects-types";

  import { get } from "svelte/store";

  import { daysPerMonth, monthFromIndex } from "./constants";
  import { _range } from "./components/TaskArea/helper";
  import {
    monthBlocks_store,
    daysViewLength_store,
  } from "./components/stores/store";

  export let rows;

  function saveConfig(cfg: GanttConfig) {
    config = cfg;
    onConfigChange(cfg);
  }

  $: ({ fields, records } = frame);

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

  function handleEventRowNew(row, rowId, fields, start: Date, due: Date) {
    const updatedValues: Record<string, Optional<DataValue>> = produce(
      row,
      (draft) => {
        draft["due"] = due;
        if (start) draft["start"] = start;
      }
    );

    api.updateRecord(
      {
        id: rowId,
        values: updatedValues,
      },
      fields
    );
  }

  function handleEventChange(
    row,
    rowId,
    fields,
    change: number,
    field: string
  ) {
    const updatedValues: Record<string, Optional<DataValue>> = produce(
      row,
      (draft) => {
        const current = draft[field];
        if (current instanceof Date) {
          draft[field] = new Date(
            current.getTime() + change * 24 * 60 * 60 * 1000
          );
        }
      }
    );

    api.updateRecord(
      {
        id: rowId,
        values: updatedValues,
      },
      fields
    );
  }

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

  $: {
    // console.log("regenerating");
    monthBlocks = [];
    daysViewLength = 0;

    let pointer = new Date();

    let diffMonth = endDate.getMonth() - pointer.getMonth() + 1 + 1; // to make the end inclusive and empty buffer in the end
    let diffYear = (endDate.getFullYear() - pointer.getFullYear()) * 12;
    let diff = diffMonth + diffYear;

    let i = 0;

    while (i < diff) {
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

      // increase month by 1
      let month = pointer.getMonth();
      if (month == 12) {
        pointer.setFullYear(pointer.getFullYear() + 1);
        pointer.setMonth(0);
      } else {
        pointer.setMonth(month + 1);
      }
      pointer.setDate(1);

      monthBlocks_store.set(monthBlocks);
      daysViewLength_store.set(daysViewLength);

      ++i;
    }
  }

  $: {
    endDate = new Date();
    rows.forEach((row) => {
      if (!row.row["due"]) {
        return;
      }
      let rowDue: Date = new Date(row.row["due"]);

      if (rowDue.getTime() > endDate.getTime()) {
        endDate = rowDue;
      }
    });
  }

  $: {
    console.log("ROWS");
    console.log(rows);
  }

  function handleFileDrop(event: DragEvent) {
    event.preventDefault();
    console.log("DROP...");

    const file = event.dataTransfer?.getData("text/html");
    console.log(file);
    if (!file) {
      return;
    }

    if (project.dataSource.kind != "folder") {
      return;
    }

    console.log("HERE");

    const projectPath = `${project.dataSource.config.path}`;
    console.log(projectPath);

    const folderPath = `${projectPath}/done`;
    const folderExist = $app.vault.getAbstractFileByPath(folderPath) as TFolder;

    if (!folderExist) {
      $app.vault.createFolder(folderPath).then(() => {
        console.log(`Folder ${folderPath} created successfully`);
      });
    }

    const reg = /data-href=".*?"/;
    const match = file.match(reg);

    let dataHref: string | undefined = undefined;
    if (match) {
      dataHref = match[0].replace(/data-href="(.*?)"/, "$1");
      console.log(dataHref);
    } else {
      console.log("No data-href found in dropped file.");
      return;
    }

    const filePath = $app.vault.getAbstractFileByPath(dataHref);
    console.log(filePath);

    if (!filePath) {
      console.log("File not found:", dataHref);
      return;
    }

    const dest = folderPath + "/" + filePath.name;

    $app.vault.rename(filePath, dest);
  }
</script>

<ViewLayout>
  <ViewContent>
    <Header {width} onColumnResize={handleWidthChange} />
    {#each rows as { rowId, row }, i}
      <EventRow
        onNew={(start, due) =>
          handleEventRowNew(row, rowId, fields, start, due)}
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
          onChange={(change, field) =>
            handleEventChange(row, rowId, fields, change, field)}
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
                const start = new Date();
                const due = new Date();
                due.setDate(start.getDate() + 1);

                api.addRecord(
                  createDataRecord(name, project, {
                    name:
                      project.dataSource.kind === "folder"
                        ? project.dataSource.config.path + "/" + name
                        : name,
                    start,
                    due,
                  }),
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
    <div
      class="drop-area"
      on:dragover={(event) => event.preventDefault()}
      on:drop={handleFileDrop}
      style=""
    >
      Drag tasks here when they're done.
    </div>
    <div class="endoccupant" />
  </ViewContent>
</ViewLayout>

<!-- </div> -->

<style>
  .drop-area {
    border: 2px dashed var(--background-modifier-border);
    padding: 10px;
    text-align: center;
    position: fixed;
    width: 100%;
  }

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

  :global(:root) {
    --gt-row-height: 1.3em;
  }
</style>
