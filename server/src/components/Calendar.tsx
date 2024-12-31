import { StartOfWeek } from "@/app/type/calendarType";
import { getDayOfWeekStr } from "@/lib/calendarUtils";
import { isHoliday } from "@/lib/holidays";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import dayjs from "dayjs";

export interface CalendarProps {
    targetMonth: dayjs.Dayjs;
    startOfWeek: StartOfWeek;
    fontSize?: number;
    padding?: string;
    targetDate?: dayjs.Dayjs;
    holidayList: { string: string }[];
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

const getDateStyle = (date: dayjs.Dayjs, holidayList: { string: string }[], targetMonth: dayjs.Dayjs, targetDate?: dayjs.Dayjs) => {
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
            color = bgColorWeekday
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
}

/**
 * 指定された年月を基準に、
 * 月曜始まりor日曜始まり で 42日分(6週)のDayjs配列を返す。
 */
export function generateCalendarDates(
    monthStart: dayjs.Dayjs,
    startOfWeek: StartOfWeek
) {
    const firstDayOfMonth = monthStart;
    const dayOfWeek = firstDayOfMonth.day(); // 0=日,1=月,...6=土

    let offset = 0;
    if (startOfWeek === "monday") {
        // 月曜始まり => 日曜なら6、その他は dayOfWeek-1
        offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    } else {
        // 日曜始まり => dayOfWeek そのまま
        offset = dayOfWeek;
    }

    // カレンダー開始日 (先月末からの穴埋めを含む)
    const startDate = firstDayOfMonth.subtract(offset, "day");

    // 42日(7日×6週)生成
    const dates: dayjs.Dayjs[] = [];
    for (let i = 0; i < 42; i++) {
        dates.push(startDate.add(i, "day"));
    }
    return dates;
}

/** 配列を指定サイズごとに分割 */
export function chunk<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export const Calendar: React.FC<CalendarProps> = ({ targetMonth, startOfWeek, holidayList, targetDate, fontSize = 16, padding }) => {

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
                result.push({ dayOfWeekStr: getDayOfWeekStr(i), color: colorWeekday });
            }
            result.push({ dayOfWeekStr: getDayOfWeekStr(6), color: colorSaturday });
            result.push({ dayOfWeekStr: getDayOfWeekStr(0), color: colorSundayOrHoliday });
        } else {
            result.push({ dayOfWeekStr: getDayOfWeekStr(0), color: colorSundayOrHoliday });
            for (let i = 1; i < 6; i++) {
                result.push({ dayOfWeekStr: getDayOfWeekStr(i), color: colorWeekday });
            }
            result.push({ dayOfWeekStr: getDayOfWeekStr(6), color: colorSaturday });
        }
        return result;
    }




    return (
        <TableContainer component={Paper} sx={{
            maxWidth: "100%",
            border: "1px solid #ccc",
            opacity: 0.8,
        }}>
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
