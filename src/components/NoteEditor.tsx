import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Check,
  Pin,
  Trash2,
  Palette,
  Copy,
  Download,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Note, NoteColor, CustomColorLabels } from '../types';
import { COLOR_CONFIG, loadColorMappingFromStorage } from '../utils/storage';
import { formatDetailedDate } from '../utils/date';


interface NoteEditorProps {
  note: Note;
  colorLabels: CustomColorLabels;
  enabledColorKeys: NoteColor[];
  onOpenLabelEditor?: () => void;
  onSave: (updatedNote: Note) => void;
  onDelete: (note: Note) => void;
  onBack: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  colorLabels,
  enabledColorKeys,
  onOpenLabelEditor,
  onSave,
  onDelete,
  onBack,
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [pinned, setPinned] = useState(Boolean(note.pinned));
  const [color, setColor] = useState<NoteColor>(note.color || 'default');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state whenever note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setPinned(Boolean(note.pinned));
    setColor(note.color || 'default');
  }, [note.id]);

  // Focus title if it's a new empty note
  useEffect(() => {
    if (!note.title && !note.content) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [note.id]);

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(260, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  // Real-time persist helper
  const triggerSave = (newTitle: string, newContent: string, newPinned: boolean, newColor: NoteColor) => {
    const updated: Note = {
      ...note,
      title: newTitle,
      content: newContent,
      pinned: newPinned,
      color: newColor,
      updatedAt: Date.now(),
    };
    onSave(updated);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    triggerSave(val, content, pinned, color);
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    triggerSave(title, val, pinned, color);
  };

  const handleTogglePin = () => {
    const nextPinned = !pinned;
    setPinned(nextPinned);
    triggerSave(title, content, nextPinned, color);
  };

  const handleSelectColor = (selected: NoteColor) => {
    setColor(selected);
    setShowColorPicker(false);
    triggerSave(title, content, pinned, selected);
  };

  const handleManualSave = () => {
    triggerSave(title, content, pinned, color);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1800);
  };

  const handleCopy = async () => {
    const fullText = `${title ? title + '\n\n' : ''}${content}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleExportTxt = () => {
    const fullText = `${title || '未命名笔记'}\n\n${content}`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(title || '笔记').slice(0, 20)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const colorPaletteOptions: NoteColor[] = enabledColorKeys && enabledColorKeys.length > 0 ? enabledColorKeys : ['default', 'amber', 'emerald'];
  const [currentMapping, setCurrentMapping] = useState(() => loadColorMappingFromStorage());

  useEffect(() => {
    const handleSync = () => {
      setCurrentMapping(loadColorMappingFromStorage());
    };
    const t = setInterval(handleSync, 500);
    return () => clearInterval(t);
  }, []);

  const mappedColorKey = currentMapping[color] || color;
  const activeTheme = COLOR_CONFIG[mappedColorKey];


  return (
    <div
      id="note-editor-container"
      className={`min-h-full flex flex-col transition-colors duration-200 ${activeTheme.bg}`}
    >
      {/* Top Android App Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-3 py-2.5 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-1.5">
          <button
            id="editor-back-btn"
            onClick={onBack}
            className="p-2 rounded-full text-zinc-700 dark:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all"
            aria-label="返回笔记列表"
            title="返回列表"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hidden sm:inline">
            编辑笔记
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Pin Button */}
          <button
            id="editor-pin-btn"
            onClick={handleTogglePin}
            className={`p-2 rounded-full transition-all ${
              pinned
                ? 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title={pinned ? '取消置顶' : '置顶笔记'}
            aria-label={pinned ? '取消置顶' : '置顶笔记'}
          >
            <Pin className={`w-4 h-4 ${pinned ? 'fill-current' : ''}`} />
          </button>

          {/* Color Picker Toggle */}
          <div className="relative">
            <button
              id="editor-color-btn"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="设置便签颜色"
              aria-label="选择背景颜色"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Color selection dropdown */}
            {showColorPicker && (
              <div
                id="color-picker-popover"
                className="absolute right-0 top-11 z-50 p-2.5 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="grid grid-cols-6 gap-2 max-w-[180px]">
                  {colorPaletteOptions.map((c) => {
                    const mappedC = currentMapping[c] || c;
                    const cfg = COLOR_CONFIG[mappedC];
                    const isCur = color === c;
                    const label = colorLabels[c] || cfg.label;
                    return (
                      <button
                        key={c}
                        id={`color-choice-${c}`}
                        onClick={() => handleSelectColor(c)}
                        title={label}
                        className={`w-6 h-6 rounded-full border border-black/10 transition-transform ${cfg.bg} ${
                          isCur ? 'scale-110 ring-2 ring-blue-500' : 'hover:scale-105'
                        }`}
                      />
                    );
                  })}
                </div>

                {onOpenLabelEditor && (
                  <button
                    id="editor-open-label-settings-btn"
                    onClick={() => {
                      setShowColorPicker(false);
                      onOpenLabelEditor();
                    }}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline text-center pt-1 border-t border-zinc-100 dark:border-zinc-700"
                  >
                    自定义分类名称
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Copy Text */}
          <button
            id="editor-copy-btn"
            onClick={handleCopy}
            className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="复制正文"
            aria-label="复制正文"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Delete Note */}
          <button
            id="editor-delete-btn"
            onClick={() => onDelete(note)}
            className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="删除笔记"
            aria-label="删除笔记"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Save / Complete Check button */}
          <button
            id="editor-save-btn"
            onClick={handleManualSave}
            className="ml-1 px-3.5 py-1.5 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-xs flex items-center gap-1 transition-all"
            aria-label="完成保存"
          >
            <Check className="w-3.5 h-3.5" />
            <span>完成</span>
          </button>
        </div>
      </header>

      {/* Floating Toasts */}
      {savedToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 bg-zinc-900/90 text-white text-xs font-medium rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>笔记已自动保存</span>
        </div>
      )}

      {copyToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 bg-zinc-900/90 text-white text-xs font-medium rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <Check className="w-3.5 h-3.5 text-blue-400" />
          <span>内容已复制到剪贴板</span>
        </div>
      )}

      {/* Writing Area */}
      <main className="flex-1 px-5 py-4 max-w-3xl w-full mx-auto flex flex-col space-y-3">
        {/* Title Input */}
        <input
          id="editor-title-input"
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="输入标题..."
          className="w-full text-2xl font-bold text-zinc-900 dark:text-zinc-100 placeholder-zinc-400/80 dark:placeholder-zinc-600 bg-transparent border-none focus:outline-hidden leading-tight"
        />

        {/* Date & Metadata Bar */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 pb-2 border-b border-black/5 dark:border-white/5 select-none">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDetailedDate(note.updatedAt || note.createdAt)}</span>
          </div>
          <span>•</span>
          <span>{content.length} 字符</span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">实时已存</span>
        </div>

        {/* Content Textarea */}
        <textarea
          id="editor-content-textarea"
          ref={textareaRef}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="输入内容记录..."
          className="w-full flex-1 bg-transparent text-base text-zinc-800 dark:text-zinc-200 placeholder-zinc-400/80 dark:placeholder-zinc-600 border-none resize-none focus:outline-hidden leading-relaxed min-h-[300px]"
        />
      </main>

      {/* Bottom status bar pill */}
      <footer className="px-5 py-3 border-t border-black/5 dark:border-white/5 text-xs text-zinc-400 flex items-center justify-between select-none">
        <span className="flex items-center gap-1 text-[11px]">
          <Sparkles className="w-3 h-3 text-amber-500" />
          无提醒干扰 · 专注随手记录
        </span>
        <button
          id="editor-bottom-back-btn"
          onClick={onBack}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          返回笔记列表
        </button>
      </footer>
    </div>
  );
};
