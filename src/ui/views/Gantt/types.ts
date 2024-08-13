export interface FieldConfig {
  readonly [key: string]: {
    readonly width?: number;
    readonly hide?: boolean;
    readonly pinned?: boolean;
  };
}

export interface GanttConfig {
  readonly fieldConfig?: FieldConfig;
  readonly sortField?: string;
  readonly sortAsc?: boolean;
  readonly orderFields?: string[];
}
