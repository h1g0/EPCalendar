import { StartOfWeek } from "@/app/type/calendarType";
import { getDayOfWeekStr, SupportedLanguages } from "@/const/i18n";
import { isHoliday } from "@/lib/holidays";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";

export interface CalendarProps {
  targetMonth: dayjs.Dayjs;
  startOfWeek: StartOfWeek;
  fontSize?: number;
  padding?: string;
  targetDate?: dayjs.Dayjs;
  holidayList: { string: string }[];
  lang?: SupportedLanguages;
}

interface DateWithStyle {
  date: dayjs.Dayjs;
  color?: string;
  bgColor?: string;
  opacity?: number;
}

const colorSaturday = "blue";
const bgColorSaturday = "white";

const colorSundayOrHoliday = "red";
const bgColorSundayOrHoliday = "white";

const colorWeekday = "black";
const bgColorWeekday = "white";

const getDateStyle = (
  date: dayjs.Dayjs,
  holidayList: { string: string }[],
  targetMonth: dayjs.Dayjs,
  targetDate?: dayjs.Dayjs,
) => {
  const day = date.day(); // 0=日,1=月,...6=土
  const holiday = isHoliday(date, holidayList);
  let color = "";
  let bgColor = "";

  let isSaturday = false;
  let isSundayOrHoliday = false;

  if (day === 6) {
    isSaturday = true;
  } else if (day === 0 || holiday) {
    isSundayOrHoliday = true;
  }

  if (targetDate && date.isSame(targetDate, "date")) {
    if (isSaturday) {
      color = bgColorSaturday;
      bgColor = colorSaturday;
    } else if (isSundayOrHoliday) {
      color = bgColorSundayOrHoliday;
      bgColor = colorSundayOrHoliday;
    } else {
      color = bgColorWeekday;
      bgColor = colorWeekday;
    }
  } else {
    if (isSaturday) {
      color = colorSaturday;
      bgColor = bgColorSaturday;
    } else if (isSundayOrHoliday) {
      color = colorSundayOrHoliday;
      bgColor = bgColorSundayOrHoliday;
    } else {
      color = colorWeekday;
      bgColor = bgColorWeekday;
    }
  }

  const sameMonth = date.isSame(targetMonth, "month");
  const opacity = sameMonth ? 1.0 : 0.5;

  return { color, bgColor, opacity };
};

/** Generate an array of 42 (= 6 weeks) dayjs objects for the calendar */
export function generateCalendarDates(
  monthStart: dayjs.Dayjs,
  startOfWeek: StartOfWeek,
): dayjs.Dayjs[] {
  const firstDayOfMonth = monthStart;
  const dayOfWeek = firstDayOfMonth.day(); // [0, 6] 0=Sunday, 6=Saturday

  let offset = 0;
  if (startOfWeek === "monday") {
    offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  } else {
    offset = dayOfWeek;
  }

  const startDate = firstDayOfMonth.subtract(offset, "day");

  const dates: dayjs.Dayjs[] = [];
  for (let i = 0; i < 42; i++) {
    dates.push(startDate.add(i, "day"));
  }
  return dates;
}

export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export const Calendar: React.FC<CalendarProps> = (
  {
    targetMonth,
    startOfWeek,
    holidayList,
    targetDate,
    fontSize = 16,
    padding,
    lang = "en",
  },
) => {
  const dates = generateCalendarDates(targetMonth, startOfWeek);
  const datesWithStyle: DateWithStyle[] = dates.map((date) => {
    const dayStyle = getDateStyle(date, holidayList, targetMonth, targetDate);
    return { date, ...dayStyle };
  });

  const rowsWithStyle = chunk(datesWithStyle, 7);

  const getHeaders = () => {
    const result = [];
    if (startOfWeek === "monday") {
      for (let i = 1; i < 6; i++) {
        result.push({
          dayOfWeekStr: getDayOfWeekStr(i, lang),
          color: colorWeekday,
        });
      }
      result.push({
        dayOfWeekStr: getDayOfWeekStr(6, lang),
        color: colorSaturday,
      });
      result.push({
        dayOfWeekStr: getDayOfWeekStr(0, lang),
        color: colorSundayOrHoliday,
      });
    } else {
      result.push({
        dayOfWeekStr: getDayOfWeekStr(0, lang),
        color: colorSundayOrHoliday,
      });
      for (let i = 1; i < 6; i++) {
        result.push({
          dayOfWeekStr: getDayOfWeekStr(i, lang),
          color: colorWeekday,
        });
      }
      result.push({
        dayOfWeekStr: getDayOfWeekStr(6, lang),
        color: colorSaturday,
      });
    }
    return result;
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: "100%",
        border: "1px solid #ccc",
        opacity: 0.8,
      }}
    >
      <Table size="small" sx={{ fontSize }}>
        <TableHead>
          <TableRow>
            {getHeaders().map((header, i) => (
              <TableCell
                key={i}
                align="center"
                sx={{
                  color: header.color,
                  fontSize,
                  padding,
                }}
              >
                {header.dayOfWeekStr}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsWithStyle.map((week, i) => (
            <TableRow key={i}>
              {week.map((date, j) => {
                return (
                  <TableCell
                    key={j}
                    align="center"
                    padding="none"
                    sx={{
                      border: "none",
                      fontSize,
                      color: date.color,
                      backgroundColor: date.bgColor,
                      opacity: date.opacity,
                      padding,
                    }}
                  >
                    {date.date.date()}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
