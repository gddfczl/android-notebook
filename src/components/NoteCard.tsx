import React, { useEffect, useState } from 'react';
import { Pin, Trash2 } from 'lucide-react';
import { Note, ViewMode } from '../types';
import { COLOR_CONFIG, loadColorMappingFromStorage } from '../utils/storage';
import { formatNoteDate } from '../utils/date';


interface NoteCardProps {
  note: Note;
  searchQuery?: string;
  viewMode: ViewMode;
  onOpen: (note: Note) => void;
  onTogglePin: (e: React.MouseEvent, id: string) => void;
  onDelete: (e: React.MouseEvent, note: Note) => void;
}

// Helper to highlight matched query text
const HighlightedText: React.FC<{ text: string; query?: string }> = ({ text, query }) => {
  if (!query || !query.trim()) {
    return <>{text}</>;
  }

  const cleanQuery = query.trim();
  const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === cleanQuery.toLowerCase() ? (
          <mark
            key={index}
            className="bg-amber-200 dark:bg-amber-600/60 text-zinc-900 dark:text-zinc-50 rounded-xs px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  searchQuery = '',
  viewMode,
  onOpen,
  onTogglePin,
  onDelete,
}) => {
  const [currentMapping, setCurrentMapping] = useState(() => loadColorMappingFromStorage());

  useEffect(() => {
    // Listen for storage updates or layout syncs smoothly
    const handleSync = () => {
      setCurrentMapping(loadColorMappingFromStorage());
    };
    window.addEventListener('storage', handleSync);
    // Interval check as a backup fallback for instant layout refresh
    const t = setInterval(handleSync, 500);
    return () => {
      window.removeEventListener('storage', handleSync);
      clearInterval(t);
    };
  }, []);

  const mappedColorKey = currentMapping[note.color || 'default'] || 'default';
  const colorTheme = COLOR_CONFIG[mappedColorKey];


  return (
    <div
      id={`note-card-${note.id}`}
      onClick={() => onOpen(note)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(note);
        }
      }}
      className={`group relative text-left rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden select-none hover:shadow-md active:scale-[0.99] focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 ${
        colorTheme.bg
      } ${colorTheme.border} ${
        viewMode === 'list' ? 'p-3.5 flex flex-col justify-between' : 'p-4 flex flex-col justify-between min-h-[140px]'
      }`}
    >
      {/* Card Header: Title & Pin Button */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-snug line-clamp-2">
            {note.title.trim() ? (
              <HighlightedText text={note.title} query={searchQuery} />
            ) : (
              <span className="italic text-zinc-400 dark:text-zinc-500 font-normal">无标题笔记</span>
            )}
          </h3>

          <div className="flex items-center gap-1 shrink-0">
            <button
              id={`pin-note-btn-${note.id}`}
              onClick={(e) => onTogglePin(e, note.id)}
              title={note.pinned ? '取消置顶' : '置顶笔记'}
              aria-label={note.pinned ? '取消置顶' : '置顶笔记'}
              className={`p-1.5 rounded-full transition-colors ${
                note.pinned
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-900/40'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 opacity-0 group-hover:opacity-100'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-current' : ''}`} />
            </button>

            <button
              id={`delete-note-btn-${note.id}`}
              onClick={(e) => onDelete(e, note)}
              title="删除笔记"
              aria-label="删除笔记"
              className="p-1.5 rounded-full text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Preview Snippet */}
        <p className={`text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed break-words ${
          viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-4'
        }`}>
          {note.content.trim() ? (
            <HighlightedText text={note.content} query={searchQuery} />
          ) : (
            <span className="text-zinc-400 italic">空白内容</span>
          )}
        </p>
      </div>

      {/* Card Footer: Timestamp & Char Count */}
      <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 border-t border-black/5 dark:border-white/5">
        <span>{formatNoteDate(note.updatedAt || note.createdAt)}</span>
        <span className="font-mono">{note.content.length} 字</span>
      </div>
    </div>
  );
};
