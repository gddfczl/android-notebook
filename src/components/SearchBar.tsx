import React from 'react';
import { Search, X, LayoutGrid, List, Tag } from 'lucide-react';
import { NoteColor, ViewMode, CustomColorLabels } from '../types';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeToggle: () => void;
  selectedColor?: NoteColor;
  onSelectColor: (color: NoteColor | undefined) => void;
  colorLabels: CustomColorLabels;
  enabledColorKeys: NoteColor[];
  onOpenLabelEditor: () => void;
  totalCount: number;
  filteredCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  viewMode,
  onViewModeToggle,
  selectedColor,
  onSelectColor,
  colorLabels,
  enabledColorKeys,
  onOpenLabelEditor,
  totalCount,
  filteredCount,
}) => {
  const fullColorsList: Array<{ key: NoteColor; defaultLabel: string }> = [
    { key: 'default', defaultLabel: '分类 1' },
    { key: 'amber', defaultLabel: '分类 2' },
    { key: 'emerald', defaultLabel: '分类 3' },
    { key: 'sky', defaultLabel: '分类 4' },
    { key: 'purple', defaultLabel: '分类 5' },
    { key: 'rose', defaultLabel: '分类 6' },
    { key: 'orange', defaultLabel: '分类 7' },
    { key: 'cyan', defaultLabel: '分类 8' },
    { key: 'lime', defaultLabel: '分类 9' },
    { key: 'pink', defaultLabel: '分类 10' },
    { key: 'indigo', defaultLabel: '分类 11' },
    { key: 'fuchsia', defaultLabel: '分类 12' },
  ];

  const colors = [
    { key: 'all' as const, defaultLabel: '全部' },
    ...fullColorsList.filter(c => enabledColorKeys.includes(c.key))
  ];

  return (
    <div id="notes-search-container" className="px-4 pt-1 pb-3 space-y-2.5">
      {/* Android Material 3 Pill Search Bar */}
      <div className="relative flex items-center bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/60 rounded-full shadow-xs px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-zinc-800">
        <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0 mr-2.5" />
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="查找笔记标题或内容..."
          className="w-full bg-transparent text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-hidden"
        />

        {query && (
          <button
            id="clear-search-button"
            onClick={() => onQueryChange('')}
            aria-label="清除搜索"
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-700 transition-colors mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* View Switch Button */}
        <button
          id="toggle-view-button"
          onClick={onViewModeToggle}
          title={viewMode === 'grid' ? '切换为列表视图' : '切换为宫格视图'}
          aria-label="切换显示方式"
          className="p-1.5 ml-1 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70 rounded-full transition-colors shrink-0"
        >
          {viewMode === 'grid' ? (
            <List className="w-4 h-4" />
          ) : (
            <LayoutGrid className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Filter and stats row */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-[85%]">
          {colors.map((c) => {
            const isSelected = (c.key === 'all' && !selectedColor) || selectedColor === c.key;
            const labelText = c.key === 'all' ? '全部' : (colorLabels[c.key] || c.defaultLabel);
            return (
              <button
                key={c.key}
                id={`filter-color-${c.key}`}
                onClick={() => onSelectColor(c.key === 'all' ? undefined : (c.key as NoteColor))}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs scale-102'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/80 dark:hover:bg-zinc-700'
                }`}
              >
                {labelText}
              </button>
            );
          })}

          {/* Edit Custom Color Labels Button */}
          <button
            id="open-edit-labels-btn"
            onClick={onOpenLabelEditor}
            title="自定义便签分类"
            aria-label="自定义标签名称"
            className="p-1 rounded-full text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 transition-colors shrink-0"
          >
            <Tag className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[10px] text-zinc-400 tabular-nums shrink-0 ml-2">
          {filteredCount}/{totalCount}
        </div>
      </div>
    </div>
  );
};
