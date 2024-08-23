import {
  ProjectView,
  type DataQueryResult,
  type ProjectViewProps,
} from "src/customViewApi";

// import TableViewSvelte from "./GanttView.svelte";
import GanttViewSvelte from "./GanttView.svelte";
import type { GanttConfig } from "./types";

export class GanttView extends ProjectView<GanttConfig> {
  view?: GanttViewSvelte | null;
  props?: ProjectViewProps;

  getViewType(): string {
    return "gantt";
  }
  getDisplayName(): string {
    return "Gantt";
  }
  getIcon(): string {
    return "table-2";
  }

  async onData({ data }: DataQueryResult) {
    this.view?.$set({ frame: data });
  }

  async onOpen(props: ProjectViewProps<GanttConfig>) {
    this.view = new GanttViewSvelte({
      target: props.contentEl,
      props: {
        frame: { fields: [], records: [] },
        api: props.viewApi,
        project: props.project,
        // readonly: props.readonly,
        config: props.config,
        onConfigChange: props.saveConfig,
        // getRecordColor: props.getRecordColor,
      },
    });
  }

  async onClose() {
    this.view?.$destroy();
    this.view = null;
  }
}
