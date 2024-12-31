import React from "react";
import dayjs from "dayjs";

import {
    Box,
    Typography,
} from "@mui/material";
import { StartOfWeek } from "@/app/type/calendarType";
import { Calendar } from "./Calendar";
import { screenSize } from "@/const/screen";
import { getDayOfWeekStr } from "@/lib/calendarUtils";
import { fetchHolidayList } from "@/lib/holidays";

interface CalendarPageProps {
    startOfWeek?: StartOfWeek;
}

export const CalendarPage: React.FC<CalendarPageProps> = async ({
    startOfWeek = "monday",
}) => {
    const today = dayjs();
    const currentMonth = today.startOf("month");
    const prevMonth = currentMonth.subtract(1, "month");
    const nextMonth = currentMonth.add(1, "month");

    const holidayList = await fetchHolidayList();

    return (
        <div>
            <Box
                sx={{
                    width: screenSize.width,
                    height: screenSize.height,
                    display: "flex",
                    flexDirection: "row",
                    backgroundImage: `url('/images/${currentMonth.format('M')}.jpg')`,
                    backgroundSize: `${screenSize.width}px`,
                }}
            >

                <Box sx={{
                    width: "70%",
                    m: 1,
                }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "center",
                        textAlign: "center",
                        p: "1",
                        alignmentBaseline: "baseline",
                        alignItems: "baseline",
                        m: 1,
                        color: "white",
                        textShadow: "0 0 16px black",
                    }}>
                        <Typography variant="h4" sx={{ mr: 2 }}>
                            {today.format("YYYY年")}
                        </Typography>
                        <Typography variant="h2" >
                            {today.format("MM月DD日")}
                        </Typography>
                        <Typography variant="h4">
                            （{getDayOfWeekStr(today.day())}）
                        </Typography>
                    </Box>
                    <Calendar
                        startOfWeek={startOfWeek}
                        holidayList={holidayList}
                        targetMonth={currentMonth}
                        targetDate={dayjs()}
                        fontSize={24}
                        padding="8px"
                    />
                </Box>

                <Box sx={{ width: "30%", m: 1, boxSizing: "border-box" }}>
                    <Box>
                        <Typography variant="h5" sx={{
                            mb: 0,
                            color: "white",
                            textShadow: "0 0 8px black",
                        }}>
                            {prevMonth.year() !== currentMonth.year() && prevMonth.format("YYYY年")}{prevMonth.format("MM月")}
                        </Typography>
                        <Calendar
                            startOfWeek={startOfWeek}
                            holidayList={holidayList}
                            targetMonth={prevMonth}
                            fontSize={12}
                            padding="4px"
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h5" sx={{
                            mb: 0,
                            color: "white",
                            textShadow: "0 0 8px black",
                        }}>
                            {nextMonth.year() !== currentMonth.year() && nextMonth.format("YYYY年")}{nextMonth.format("MM月")}
                        </Typography>
                        <Calendar
                            startOfWeek={startOfWeek}
                            holidayList={holidayList}
                            targetMonth={nextMonth}
                            fontSize={12}
                            padding={'4px'} />
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

