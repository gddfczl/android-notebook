import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Note } from '../types';

interface DeleteConfirmModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  note,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !note) return null;

  return (
    <div
      id="delete-confirm-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="delete-confirm-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700 space-y-4 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              删除此笔记？
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              删除后将无法恢复
            </p>
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 bg-zinc-50 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 italic">
          "{note.title || note.content.slice(0, 40) || '无标题笔记'}"
        </p>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            id="cancel-delete-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            取消
          </button>
          <button
            id="confirm-delete-btn"
            onClick={() => {
              onConfirm(note.id);
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-full shadow-xs transition-colors"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
};
