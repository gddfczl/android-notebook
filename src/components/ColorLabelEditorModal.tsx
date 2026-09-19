import React, { useState, useEffect } from 'react';
import { Tag, RotateCcw, Check, X, Palette, PlusCircle, MinusCircle } from 'lucide-react';
import { NoteColor, CustomColorLabels, ColorMapping } from '../types';
import { COLOR_CONFIG, DEFAULT_COLOR_LABELS, DEFAULT_COLOR_MAPPING, ALL_ORDERED_COLORS, INITIAL_ENABLED_KEYS } from '../utils/storage';

interface ColorLabelEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  colorLabels: CustomColorLabels;
  colorMapping: ColorMapping;
  enabledColorKeys: NoteColor[];
  onSave: (newLabels: CustomColorLabels, newMapping: ColorMapping, newEnabledKeys: NoteColor[]) => void;
}

export const ColorLabelEditorModal: React.FC<ColorLabelEditorModalProps> = ({
  isOpen,
  onClose,
  colorLabels,
  colorMapping,
  enabledColorKeys,
  onSave,
}) => {
  const [draftLabels, setDraftLabels] = useState<CustomColorLabels>(colorLabels);
  const [draftMapping, setDraftMapping] = useState<ColorMapping>(colorMapping);
  const [draftEnabledKeys, setDraftEnabledKeys] = useState<NoteColor[]>(enabledColorKeys);
  const [activeSelectColorKey, setActiveSelectColorKey] = useState<NoteColor | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDraftLabels(colorLabels);
      setDraftMapping(colorMapping);
      setDraftEnabledKeys(enabledColorKeys);
      setActiveSelectColorKey(null);
    }
  }, [isOpen, colorLabels, colorMapping, enabledColorKeys]);

  if (!isOpen) return null;

  const handleAddCategory = () => {
    const nextColor = ALL_ORDERED_COLORS.find(c => !draftEnabledKeys.includes(c));
    if (nextColor) {
      setDraftEnabledKeys(prev => [...prev, nextColor]);
    }
  };

  const handleRemoveCategory = (colorKey: NoteColor) => {
    if (draftEnabledKeys.length <= 1) return; // Keep at least one
    setDraftEnabledKeys(prev => prev.filter(k => k !== colorKey));
    if (activeSelectColorKey === colorKey) setActiveSelectColorKey(null);
  };

  const handleChangeLabel = (color: NoteColor, value: string) => {
    setDraftLabels((prev) => ({
      ...prev,
      [color]: value,
    }));
  };

  const handleSelectColorForCategory = (categoryKey: NoteColor, selectedPaletteColor: NoteColor) => {
    setDraftMapping((prev) => ({
      ...prev,
      [categoryKey]: selectedPaletteColor,
    }));
    setActiveSelectColorKey(null);
  };

  const handleResetToDefault = () => {
    setDraftLabels({ ...DEFAULT_COLOR_LABELS });
    setDraftMapping({ ...DEFAULT_COLOR_MAPPING });
    setDraftEnabledKeys([...INITIAL_ENABLED_KEYS]);
    setActiveSelectColorKey(null);
  };

  const handleSave = () => {
    const sanitizedLabels: CustomColorLabels = { ...draftLabels };
    for (const c of ALL_ORDERED_COLORS) {
      if (!sanitizedLabels[c] || !sanitizedLabels[c].trim()) {
        sanitizedLabels[c] = DEFAULT_COLOR_LABELS[c];
      } else {
        sanitizedLabels[c] = sanitizedLabels[c].trim().slice(0, 10);
      }
    }
    onSave(sanitizedLabels, draftMapping, draftEnabledKeys);
    onClose();
  };

  const canAdd = draftEnabledKeys.length < ALL_ORDERED_COLORS.length;

  return (
    <div
      id="color-label-editor-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="color-label-editor-dialog"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-3xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-700 space-y-4 animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-700/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                自定义便签分类
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                默认提供 3 个常用分类，您可以按需自由添加或移除
              </p>
            </div>
          </div>
          <button
            id="close-color-label-modal-btn"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Fields for each color */}
        <div className="space-y-3 overflow-y-auto pr-1 flex-1 py-1">
          {draftEnabledKeys.map((colorKey) => {
            const mappedPaletteColor = draftMapping[colorKey] || colorKey;
            const config = COLOR_CONFIG[mappedPaletteColor];
            const defaultName = DEFAULT_COLOR_LABELS[colorKey];
            const currentVal = draftLabels[colorKey] ?? '';
            const isChoosingColor = activeSelectColorKey === colorKey;

            return (
              <div
                key={colorKey}
                className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 space-y-2 relative"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Color preview circle & button to drop color picker */}
                  <button
                    type="button"
                    onClick={() => setActiveSelectColorKey(isChoosingColor ? null : colorKey)}
                    className={`w-9 h-9 rounded-full shrink-0 border border-black/10 ${config.bg} flex items-center justify-center relative shadow-xs active:scale-95 transition-transform group`}
                    title="点击更改底色"
                  >
                    <Palette className="w-4 h-4 text-zinc-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </button>

                  {/* Input */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                      <span>默认: {defaultName}</span>
                      <span>{currentVal.length}/10</span>
                    </div>
                    <input
                      id={`custom-label-input-${colorKey}`}
                      type="text"
                      maxLength={10}
                      value={currentVal}
                      onChange={(e) => handleChangeLabel(colorKey, e.target.value)}
                      placeholder={defaultName}
                      className="w-full bg-white dark:bg-zinc-800 text-xs px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-2xs"
                    />
                  </div>

                  {/* Remove Button */}
                  {draftEnabledKeys.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(colorKey)}
                      className="p-1.5 text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-full transition-colors shrink-0"
                      title="移除此分类"
                    >
                      <MinusCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sub Color Picker Panel inside row */}
                {isChoosingColor && (
                  <div className="pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-700/60 animate-in fade-in slide-in-from-top-1 duration-100">
                    <div className="text-[11px] font-medium text-zinc-400 mb-1.5">为此分类挑选一个精美底色：</div>
                    <div className="grid grid-cols-6 gap-2">
                      {ALL_ORDERED_COLORS.map((pColor) => {
                        const pConfig = COLOR_CONFIG[pColor];
                        const isSelectedOption = mappedPaletteColor === pColor;
                        return (
                          <button
                            key={pColor}
                            type="button"
                            onClick={() => handleSelectColorForCategory(colorKey, pColor)}
                            title={pConfig.label}
                            className={`w-6 h-6 rounded-full border border-black/10 ${pConfig.bg} relative transition-all ${
                              isSelectedOption ? 'ring-2 ring-blue-500 scale-110 shadow-md' : 'hover:scale-105 active:scale-95'
                            }`}
                          >
                            {isSelectedOption && (
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-blue-600 font-bold">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Category Trigger button */}
          {canAdd && (
            <button
              type="button"
              onClick={handleAddCategory}
              className="w-full py-2.5 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 bg-zinc-50/50 dark:bg-zinc-900/30 active:scale-99 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>添加新分类</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-700/60 shrink-0">
          <button
            id="reset-color-labels-btn"
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors py-1.5 px-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="cancel-color-labels-btn"
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
            >
              取消
            </button>
            <button
              id="save-color-labels-btn"
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-full shadow-md transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>保存分类设置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
