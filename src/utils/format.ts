/** "2026-10-12 15:30:00" -> "15:30:00"；本身只有时间则原样返回 */
export const formatTime = (date: string): string =>
  date.length > 10 ? (date.split(' ')[1] ?? '') : date

/** "2026-10-12 15:30:00" -> "10-12"；本身只有时间则原样返回 */
export const formatDay = (date: string): string =>
  date.length > 10 ? date.slice(5, 10) : date

/** 时间字符串转可比较的数值，用于倒序排序 */
export const sortKey = (date: string): number =>
  Number.parseInt(date.replace(/[/: ]/g, ''), 10) || 0
