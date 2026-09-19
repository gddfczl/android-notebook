export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  color?: NoteColor;
}

export type NoteColor = 'default' | 'amber' | 'emerald' | 'sky' | 'purple' | 'rose' | 'orange' | 'cyan' | 'lime' | 'pink' | 'indigo' | 'fuchsia';

export type CustomColorLabels = Record<NoteColor, string>;

export type ViewMode = 'grid' | 'list';

export interface NoteFilter {
  searchQuery: string;
  sortBy: 'updatedAt' | 'createdAt' | 'title';
  filterColor?: NoteColor;
}

export type ColorMapping = Record<NoteColor, NoteColor>;

export interface AppColorState {
  labels: CustomColorLabels;
  mapping: ColorMapping;
  enabledKeys: NoteColor[];
}


