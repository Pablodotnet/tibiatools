const MAX_STAMINA = 42 * 60; // 2520 minutes
const GREEN_THRESHOLD = 40 * 60; // 2400 minutes

export interface StaminaResult {
  currentMinutes: number;
  minutesToGreen: number;
  minutesToFull: number;
  minutesBelowGreen: number;
}

export function calculateStamina(hours: number, minutes: number): StaminaResult | null {
  const totalMinutes = hours * 60 + minutes;
  if (isNaN(totalMinutes) || totalMinutes < 0) return null;
  if (totalMinutes >= MAX_STAMINA) {
    return {
      currentMinutes: MAX_STAMINA,
      minutesToGreen: 0,
      minutesToFull: 0,
      minutesBelowGreen: 0,
    };
  }

  const belowGreen = totalMinutes < GREEN_THRESHOLD ? GREEN_THRESHOLD - totalMinutes : 0;

  let minutesToGreen = 0;
  let minutesToFull = 0;

  if (totalMinutes < GREEN_THRESHOLD) {
    const greenNeeded = GREEN_THRESHOLD - totalMinutes;
    minutesToGreen = greenNeeded * 3;
    minutesToFull = minutesToGreen + (MAX_STAMINA - GREEN_THRESHOLD) * 10;
  } else {
    const fullNeeded = MAX_STAMINA - totalMinutes;
    minutesToFull = fullNeeded * 10;
    minutesToGreen = 0;
  }

  return {
    currentMinutes: totalMinutes,
    minutesToGreen,
    minutesToFull,
    minutesBelowGreen: belowGreen,
  };
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
}
