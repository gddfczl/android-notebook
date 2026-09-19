/**
 * Format timestamp into Android style friendly date strings
 */
export function formatNoteDate(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);
  
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 1) {
    return '刚刚';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} 分钟前`;
  }

  const isToday = 
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  const pad = (n: number) => n.toString().padStart(2, '0');
  const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  if (isToday) {
    return `今天 ${timeStr}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = 
    yesterday.getFullYear() === date.getFullYear() &&
    yesterday.getMonth() === date.getMonth() &&
    yesterday.getDate() === date.getDate();

  if (isYesterday) {
    return `昨天 ${timeStr}`;
  }

  const isCurrentYear = now.getFullYear() === date.getFullYear();
  const monthDay = `${date.getMonth() + 1}月${date.getDate()}日`;

  if (isCurrentYear) {
    return `${monthDay} ${timeStr}`;
  }

  return `${date.getFullYear()}年${monthDay}`;
}

export function formatDetailedDate(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
