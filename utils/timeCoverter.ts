export function parseDurationToSeconds(duration: string): number {
  const regex =
    /(\d+)\s*(h|hr|hrs|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)?/gi;
  let totalSeconds = 0;
  let match;

  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2]?.toLowerCase() ?? "s";

    switch (unit) {
      case "h":
      case "hr":
      case "hrs":
      case "hour":
      case "hours":
        totalSeconds += value * 3600;
        break;
      case "m":
      case "min":
      case "mins":
      case "minute":
      case "minutes":
        totalSeconds += value * 60;
        break;
      case "s":
      case "sec":
      case "secs":
      case "second":
      case "seconds":
      default:
        totalSeconds += value;
        break;
    }
  }

  if (totalSeconds === 0) {
    const onlyNum = parseInt(duration);
    if (!isNaN(onlyNum)) totalSeconds = onlyNum * 60;
  }

  return totalSeconds;
}

export function formatToHrsMins(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}
