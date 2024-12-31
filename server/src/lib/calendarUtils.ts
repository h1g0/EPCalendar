
const dayOfWeekStrArray = ["日", "月", "火", "水", "木", "金", "土"];

export function getDayOfWeekStr(day: number) {
    return dayOfWeekStrArray[day] || "";
}

