import dayjs from "dayjs";
import axios from "axios";

export async function fetchHolidayList() {
  try {
    const response = await axios.get(
      "https://holidays-jp.github.io/api/v1/date.json",
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return {};
  }
}

export function isHoliday(
  date: dayjs.Dayjs,
  holidayList: { string: string }[],
): boolean {
  const dateStr = date.format("YYYY-MM-DD");
  return Object.keys(holidayList).includes(dateStr);
}
