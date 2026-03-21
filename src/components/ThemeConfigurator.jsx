import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { X, Check } from 'lucide-react';

const ThemeConfigurator = () => {
  const {
    theme, setTheme,
    primaryColor, setPrimaryColor,
    scale, setScale,
    menuType, setMenuType,
    menuTheme, setMenuTheme,
    inputStyle, setInputStyle,
    isSettingsOpen, setIsSettingsOpen
  } = useTheme();

  if (!isSettingsOpen) return null;

  const themesColors = [
    { name: 'blue', value: '#3b82f6' },
    { name: 'emerald', value: '#10b981' },
    { name: 'violet', value: '#8b5cf6' },
    { name: 'teal', value: '#14b8a6' },
    { name: 'cyan', value: '#06b6d4' },
    { name: 'orange', value: '#f97316' },
    { name: 'amber', value: '#f59e0b' },
    { name: 'pink', value: '#ec4899' }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity" 
        onClick={() => setIsSettingsOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[300px] bg-surface-card shadow-2xl z-[101] overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-surface-border text-color">
        
        <div className="flex justify-between items-center p-4 border-b border-surface-border sticky top-0 bg-surface-card z-10">
          <span className="font-semibold">Configurator</span>
          <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-surface-hover rounded-full transition-colors text-color-secondary hover:text-color">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Themes */}
          <div>
            <h4 className="font-semibold mb-3">Themes</h4>
            <div className="flex flex-wrap gap-3">
              {themesColors.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setPrimaryColor(t.name)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                  style={{ backgroundColor: t.value }}
                >
                  {primaryColor === t.name && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div>
            <h4 className="font-semibold mb-3">Scale</h4>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setScale(Math.max(12, scale - 1))}
                className="w-6 h-6 flex items-center justify-center border border-surface-border rounded-full hover:bg-surface-hover text-color-secondary hover:text-color"
              >
                -
              </button>
              {[12, 13, 14, 15, 16].map((s) => (
                <div 
                  key={s} 
                  className={`w-2.5 h-2.5 rounded-full ${s === scale ? 'bg-[var(--primary-color)]' : 'bg-surface-border'}`}
                ></div>
              ))}
              <button 
                onClick={() => setScale(Math.min(16, scale + 1))}
                className="w-6 h-6 flex items-center justify-center border border-surface-border rounded-full hover:bg-surface-hover text-color-secondary hover:text-color"
              >
                +
              </button>
            </div>
          </div>

          {/* Menu Type */}
          <div>
            <h4 className="font-semibold mb-3 text-color">Menu Type</h4>
            <div className="grid grid-cols-2 gap-3 text-sm text-color-secondary">
              {['static', 'overlay'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="menuType" 
                    value={type}
                    checked={menuType === type}
                    onChange={(e) => setMenuType(e.target.value)}
                    className="w-4 h-4 text-[var(--primary-color)] bg-surface-card border-surface-border"
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Menu Theme */}
          <div>
            <h4 className="font-semibold mb-3 text-color">Menu Theme</h4>
            <div className="space-y-3 text-sm text-color-secondary">
              {['colorScheme', 'primaryColor', 'transparent'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="menuTheme" 
                    value={type}
                    checked={menuTheme === type}
                    onChange={(e) => setMenuTheme(e.target.value)}
                    className="w-4 h-4 text-[var(--primary-color)] bg-surface-card border-surface-border"
                  />
                  <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <h4 className="font-semibold mb-3 text-color">Color Scheme</h4>
            <div className="space-y-3 text-sm text-color-secondary">
              {['light', 'dim', 'dark'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="colorScheme" 
                    value={type}
                    checked={theme === type}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-4 h-4 text-[var(--primary-color)] bg-surface-card border-surface-border"
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Input Style */}
          <div>
            <h4 className="font-semibold mb-3 text-color">Input Style</h4>
            <div className="grid grid-cols-2 gap-3 text-sm text-color-secondary">
              {['outlined', 'filled'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="inputStyle" 
                    value={type}
                    checked={inputStyle === type}
                    onChange={(e) => setInputStyle(e.target.value)}
                    className="w-4 h-4 text-[var(--primary-color)] bg-surface-card border-surface-border"
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ThemeConfigurator;
