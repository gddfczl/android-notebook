import { Note, NoteColor, CustomColorLabels, ColorMapping } from '../types';

const STORAGE_KEY = 'android_notepad_notes_v1';
const COLOR_LABELS_STORAGE_KEY = 'android_notepad_color_labels_v3';
const COLOR_MAPPING_STORAGE_KEY = 'android_notepad_color_mapping_v3';
const COLOR_ENABLED_KEYS_KEY = 'android_notepad_color_enabled_keys_v3';

export const ALL_ORDERED_COLORS: NoteColor[] = [
  'default', 'amber', 'emerald', 'sky', 'purple', 'rose',
  'orange', 'cyan', 'lime', 'pink', 'indigo', 'fuchsia'
];

export const INITIAL_ENABLED_KEYS: NoteColor[] = ['default', 'amber', 'emerald'];


export const DEFAULT_COLOR_LABELS: CustomColorLabels = {
  default: '分类 1',
  amber: '分类 2',
  emerald: '分类 3',
  sky: '分类 4',
  purple: '分类 5',
  rose: '分类 6',
  orange: '分类 7',
  cyan: '分类 8',
  lime: '分类 9',
  pink: '分类 10',
  indigo: '分类 11',
  fuchsia: '分类 12',
};

export const DEFAULT_COLOR_MAPPING: ColorMapping = {
  default: 'default',
  amber: 'amber',
  emerald: 'emerald',
  sky: 'sky',
  purple: 'purple',
  rose: 'rose',
  orange: 'orange',
  cyan: 'cyan',
  lime: 'lime',
  pink: 'pink',
  indigo: 'indigo',
  fuchsia: 'fuchsia',
};

export const COLOR_CONFIG: Record<NoteColor, { bg: string; border: string; activeRing: string; label: string }> = {
  default: {
    bg: 'bg-white dark:bg-zinc-800',
    border: 'border-zinc-200 dark:border-zinc-700',
    activeRing: 'ring-zinc-400',
    label: '默认白',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800/60',
    activeRing: 'ring-amber-500',
    label: '暖黄',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    activeRing: 'ring-emerald-500',
    label: '薄荷绿',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-200 dark:border-sky-800/60',
    activeRing: 'ring-sky-500',
    label: '晴空蓝',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800/60',
    activeRing: 'ring-purple-500',
    label: '浅薰紫',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800/60',
    activeRing: 'ring-rose-500',
    label: '柔樱粉',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    border: 'border-orange-200 dark:border-orange-800/60',
    activeRing: 'ring-orange-500',
    label: '活力橙',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    border: 'border-cyan-200 dark:border-cyan-800/60',
    activeRing: 'ring-cyan-500',
    label: '湖水蓝',
  },
  lime: {
    bg: 'bg-lime-50 dark:bg-lime-950/40',
    border: 'border-lime-200 dark:border-lime-800/60',
    activeRing: 'ring-lime-500',
    label: '青柠绿',
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    border: 'border-pink-200 dark:border-pink-800/60',
    activeRing: 'ring-pink-500',
    label: '胭脂粉',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-200 dark:border-indigo-800/60',
    activeRing: 'ring-indigo-500',
    label: '幽邃蓝',
  },
  fuchsia: {
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
    border: 'border-fuchsia-200 dark:border-fuchsia-800/60',
    activeRing: 'ring-fuchsia-500',
    label: '迷幻紫',
  },
};


const INITIAL_NOTES: Note[] = [
  {
    id: 'note_init_1',
    title: '欢迎使用安卓记事本',
    content: '这是一个专门为您打造的简洁安卓风格记事本。\n\n• 点击右下角「+」快速新建笔记\n• 支持输入标题与详细内容记录\n• 顶栏支持关键词实时查找\n• 点击任意卡片即可随时进入二次编辑\n• 支持置顶星标与色彩便签分类',
    createdAt: Date.now() - 1000 * 60 * 30, // 30 mins ago
    updatedAt: Date.now() - 1000 * 60 * 30,
    pinned: true,
    color: 'amber',
  },
  {
    id: 'note_init_2',
    title: '项目灵感草稿',
    content: '1. 界面采用 Material 3 现代安卓设计规范\n2. 标题字号清晰，排版舒适\n3. 文本内容自动实时保存，防止数据丢失\n4. 纯净无提醒打扰，专注记录生活与工作',
    createdAt: Date.now() - 1000 * 60 * 120, // 2 hours ago
    updatedAt: Date.now() - 1000 * 60 * 90,
    pinned: false,
    color: 'emerald',
  },
  {
    id: 'note_init_3',
    title: '常用资料随手记',
    content: '随时记录日常阅读摘录、会议纪要、待办随想。无需繁琐设置，打开即写，一键查找。',
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 20,
    pinned: false,
    color: 'sky',
  },
];

export function loadNotesFromStorage(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTES));
      return INITIAL_NOTES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_NOTES;
  } catch (error) {
    console.warn('Failed to load notes from localStorage, using fallback:', error);
    return INITIAL_NOTES;
  }
}

export function saveNotesToStorage(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes to localStorage:', error);
  }
}

export function loadColorLabelsFromStorage(): CustomColorLabels {
  try {
    const raw = localStorage.getItem(COLOR_LABELS_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_COLOR_LABELS };
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_COLOR_LABELS,
      ...parsed,
    };
  } catch (error) {
    console.warn('Failed to load custom color labels, using default:', error);
    return { ...DEFAULT_COLOR_LABELS };
  }
}

export function saveColorLabelsToStorage(labels: CustomColorLabels): void {
  try {
    localStorage.setItem(COLOR_LABELS_STORAGE_KEY, JSON.stringify(labels));
  } catch (error) {
    console.error('Failed to save color labels to localStorage:', error);
  }
}

export function loadColorMappingFromStorage(): ColorMapping {
  try {
    const raw = localStorage.getItem(COLOR_MAPPING_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_COLOR_MAPPING };
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_COLOR_MAPPING,
      ...parsed,
    };
  } catch (error) {
    return { ...DEFAULT_COLOR_MAPPING };
  }
}

export function saveColorMappingToStorage(mapping: ColorMapping): void {
  try {
    localStorage.setItem(COLOR_MAPPING_STORAGE_KEY, JSON.stringify(mapping));
  } catch (error) {
    console.error('Failed to save color mapping:', error);
  }
}

export function loadEnabledColorKeysFromStorage(): NoteColor[] {
  try {
    const raw = localStorage.getItem(COLOR_ENABLED_KEYS_KEY);
    if (!raw) return [...INITIAL_ENABLED_KEYS];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [...INITIAL_ENABLED_KEYS];
  } catch {
    return [...INITIAL_ENABLED_KEYS];
  }
}

export function saveEnabledColorKeysToStorage(keys: NoteColor[]): void {
  try {
    localStorage.setItem(COLOR_ENABLED_KEYS_KEY, JSON.stringify(keys));
  } catch (error) {
    console.error('Failed to save enabled keys:', error);
  }
}


