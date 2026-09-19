import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface StatusBarProps {
  dark?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ dark = false }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      id="android-status-bar"
      className={`w-full px-6 py-2.5 flex items-center justify-between text-xs font-medium select-none z-20 transition-colors ${
        dark ? 'text-zinc-200 bg-transparent' : 'text-zinc-800 dark:text-zinc-200 bg-transparent'
      }`}
    >
      {/* Left: Time & Notif dot */}
      <div className="flex items-center gap-1.5">
        <span className="font-semibold tracking-tight">{timeStr || '12:00'}</span>
      </div>

      {/* Center: Subtle front-camera pinhole simulator */}
      <div className="w-3.5 h-3.5 rounded-full bg-zinc-900/80 ring-1 ring-zinc-700/30 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-950"></div>
      </div>

      {/* Right: Icons (Signal, Wifi, Battery) */}
      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-1">
          <BatteryMedium className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
