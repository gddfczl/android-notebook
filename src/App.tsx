import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  StickyNote,
  Smartphone,
  Maximize2,
  Minimize2,
  Trash2,
  Search,
  Pin,
  FileText,
  SortDesc,
} from 'lucide-react';
import { Note, NoteColor, ViewMode, CustomColorLabels } from './types';
import { loadNotesFromStorage, saveNotesToStorage, loadColorLabelsFromStorage, saveColorLabelsToStorage, loadColorMappingFromStorage, saveColorMappingToStorage, loadEnabledColorKeysFromStorage, saveEnabledColorKeysToStorage } from './utils/storage';
import { SearchBar } from './components/SearchBar';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ColorLabelEditorModal } from './components/ColorLabelEditorModal';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotesFromStorage());
  const [colorLabels, setColorLabels] = useState<CustomColorLabels>(() => loadColorLabelsFromStorage());
  const [colorMapping, setColorMapping] = useState<ColorMapping>(() => loadColorMappingFromStorage());
  const [enabledColorKeys, setEnabledColorKeys] = useState<NoteColor[]>(() => loadEnabledColorKeysFromStorage());
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState<NoteColor | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'title'>('updatedAt');
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [isColorLabelModalOpen, setIsColorLabelModalOpen] = useState(false);

  // Sync notes to storage
  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  // Sync color labels and mapping to storage
  useEffect(() => {
    saveColorLabelsToStorage(colorLabels);
    saveColorMappingToStorage(colorMapping);
    saveEnabledColorKeysToStorage(enabledColorKeys);
  }, [colorLabels, colorMapping, enabledColorKeys]);



  // Active note lookup
  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  // Filter & Search & Sort
  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let result = notes.filter((note) => {
      const matchSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q);
      const matchColor = !selectedColor || note.color === selectedColor;
      return matchSearch && matchColor;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'zh-CN');
      }
      if (sortBy === 'createdAt') {
        return b.createdAt - a.createdAt;
      }
      return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
    });

    return result;
  }, [notes, searchQuery, selectedColor, sortBy]);

  // Separate pinned and unpinned notes
  const { pinnedNotes, otherNotes } = useMemo(() => {
    const pinned: Note[] = [];
    const other: Note[] = [];
    for (const note of filteredNotes) {
      if (note.pinned) {
        pinned.push(note);
      } else {
        other.push(note);
      }
    }
    return { pinnedNotes: pinned, otherNotes: other };
  }, [filteredNotes]);

  // Create a new note
  const handleCreateNote = () => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      color: 'default',
      pinned: false,
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  // Update existing note
  const handleSaveNote = (updated: Note) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updated.id ? updated : n))
    );
  };

  // Toggle pin
  const handleTogglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n))
    );
  };

  // Trigger delete modal
  const handleRequestDelete = (e: React.MouseEvent | null, note: Note) => {
    if (e) e.stopPropagation();
    setDeleteTarget(note);
  };

  // Confirm delete
  const handleConfirmDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center sm:py-6 sm:px-4 font-sans antialiased text-zinc-800 dark:text-zinc-100 selection:bg-blue-500/30">
      {/* Top Device / View Switcher Controls (Desktop Bar) */}
      <header className="w-full max-w-4xl mb-3 px-4 hidden sm:flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-zinc-200">安卓记事本</span>
          <span className="text-zinc-500">|</span>
          <span>随手记录 · 快速查找 · 随时编辑</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sorting selection */}
          <div className="flex items-center gap-1.5 bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-700/60">
            <SortDesc className="w-3.5 h-3.5 text-zinc-400" />
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-300 focus:outline-hidden cursor-pointer"
            >
              <option value="updatedAt" className="bg-zinc-800 text-zinc-200">按修改时间</option>
              <option value="createdAt" className="bg-zinc-800 text-zinc-200">按创建时间</option>
              <option value="title" className="bg-zinc-800 text-zinc-200">按标题排序</option>
            </select>
          </div>

          {/* Phone Frame Toggle */}
          <button
            id="toggle-frame-mode-btn"
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 px-3 py-1 rounded-full border border-zinc-700/60 transition-colors"
            title={isPhoneFrame ? '切换为宽屏模式' : '切换为安卓手机框'}
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>展开全宽</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>手机框架</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container (Simulated Android Phone or Responsive App Container) */}
      <div
        id="android-device-shell"
        className={`w-full transition-all duration-300 relative flex flex-col bg-zinc-50 dark:bg-zinc-900 shadow-2xl overflow-hidden ${
          isPhoneFrame
            ? 'sm:max-w-[430px] sm:h-[840px] sm:rounded-[42px] sm:border-[8px] sm:border-zinc-800 sm:ring-1 sm:ring-zinc-700/50 min-h-screen sm:min-h-0'
            : 'max-w-4xl min-h-[780px] sm:rounded-3xl border border-zinc-800'
        }`}
      >
        {/* Android Status Bar removed as per user instruction */}

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto relative">
          {activeNote ? (
            /* Note Editor Screen */
            <NoteEditor
              note={activeNote}
              colorLabels={colorLabels}
              enabledColorKeys={enabledColorKeys}
              onOpenLabelEditor={() => setIsColorLabelModalOpen(true)}
              onSave={handleSaveNote}
              onDelete={(n) => handleRequestDelete(null, n)}
              onBack={() => setActiveNoteId(null)}
            />
          ) : (
            /* Notes List Screen */
            <div className="flex-1 flex flex-col pb-24">
              {/* App Title Bar in Android Material Style */}
              <div className="px-5 pt-3 pb-1 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    记事本
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    无提醒打扰 · 专注思考与速记
                  </p>
                </div>

                {/* Mobile Sort Menu */}
                <div className="sm:hidden">
                  <select
                    id="mobile-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-zinc-100 dark:bg-zinc-800 text-xs px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                  >
                    <option value="updatedAt">最近修改</option>
                    <option value="createdAt">创建时间</option>
                    <option value="title">标题顺序</option>
                  </select>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <SearchBar
                query={searchQuery}
                onQueryChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeToggle={() => setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'))}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
                colorLabels={colorLabels}
                enabledColorKeys={enabledColorKeys}
                onOpenLabelEditor={() => setIsColorLabelModalOpen(true)}
                totalCount={notes.length}
                filteredCount={filteredNotes.length}
              />

              {/* Main List / Grid Display */}
              <main className="flex-1 px-4 py-2">
                {filteredNotes.length === 0 ? (
                  /* Empty State */
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                      {searchQuery ? <Search className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                        {searchQuery ? '未找到匹配的笔记' : '还没有任何记事'}
                      </h4>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs">
                        {searchQuery
                          ? `没有找到包含 "${searchQuery}" 的笔记，请尝试其他关键词。`
                          : '点击右下角的「+」号开始创建第一条记事吧！'}
                      </p>
                    </div>
                    {searchQuery ? (
                      <button
                        id="clear-search-empty-btn"
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium pt-1"
                      >
                        清空查找条件
                      </button>
                    ) : (
                      <button
                        id="empty-create-note-btn"
                        onClick={handleCreateNote}
                        className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs transition-colors"
                      >
                        新建笔记
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Pinned Section */}
                    {pinnedNotes.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 px-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                          <Pin className="w-3.5 h-3.5 fill-current" />
                          <span>已置顶</span>
                        </div>
                        <div
                          className={
                            viewMode === 'grid'
                              ? 'grid grid-cols-2 gap-2.5'
                              : 'flex flex-col gap-2'
                          }
                        >
                          {pinnedNotes.map((note) => (
                            <NoteCard
                              key={note.id}
                              note={note}
                              searchQuery={searchQuery}
                              viewMode={viewMode}
                              onOpen={(n) => setActiveNoteId(n.id)}
                              onTogglePin={handleTogglePin}
                              onDelete={handleRequestDelete}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Other Notes Section */}
                    {otherNotes.length > 0 && (
                      <div className="space-y-2">
                        {pinnedNotes.length > 0 && (
                          <div className="px-1 text-xs font-medium text-zinc-400 dark:text-zinc-500 pt-1">
                            全部笔记
                          </div>
                        )}
                        <div
                          className={
                            viewMode === 'grid'
                              ? 'grid grid-cols-2 gap-2.5'
                              : 'flex flex-col gap-2'
                          }
                        >
                          {otherNotes.map((note) => (
                            <NoteCard
                              key={note.id}
                              note={note}
                              searchQuery={searchQuery}
                              viewMode={viewMode}
                              onOpen={(n) => setActiveNoteId(n.id)}
                              onTogglePin={handleTogglePin}
                              onDelete={handleRequestDelete}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </main>

              {/* Android Material 3 Floating Action Button (FAB) */}
              <div className="fixed sm:absolute bottom-6 right-6 z-40">
                <button
                  id="create-note-fab"
                  onClick={handleCreateNote}
                  className="group flex items-center gap-2 px-4 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
                  aria-label="新建笔记"
                  title="新建笔记"
                >
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-200" />
                  <span className="pr-0.5 tracking-wide">记一笔</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Android Gesture Navigation Pill at Bottom */}
        <div className="w-full py-2 flex items-center justify-center bg-transparent shrink-0 select-none">
          <div className="w-32 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        note={deleteTarget}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Custom Color Labels Editor Modal */}
      <ColorLabelEditorModal
        isOpen={isColorLabelModalOpen}
        onClose={() => setIsColorLabelModalOpen(false)}
        colorLabels={colorLabels}
        colorMapping={colorMapping}
        enabledColorKeys={enabledColorKeys}
        onSave={(newLabels, newMapping, newEnabledKeys) => {
          setColorLabels(newLabels);
          setColorMapping(newMapping);
          setEnabledColorKeys(newEnabledKeys);
        }}
      />
    </div>
  );
}
