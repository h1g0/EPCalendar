import React from "react";
import dayjs from "dayjs";

import { Box, Typography } from "@mui/material";
import { StartOfWeek, SupportedLanguages } from "@/app/type";
import { Calendar } from "./Calendar";
import { screenSize } from "@/const/screen";
import { fetchHolidayList } from "@/lib/holidays";
import { formatI18n } from "@/const/i18n";

interface CalendarPageProps {
  date?: dayjs.Dayjs;
  startOfWeek?: StartOfWeek;
  lang?: SupportedLanguages;
}

export const CalendarPage: React.FC<CalendarPageProps> = async ({
  date = dayjs(),
  startOfWeek = "monday",
  lang = "en",
}) => {
  const today = date;
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
          backgroundImage: `url('/images/${currentMonth.format("M")}.jpg')`,
          backgroundSize: `${screenSize.width}px`,
        }}
      >
        <Box
          sx={{
            width: "70%",
            m: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              textAlign: "center",
              alignmentBaseline: "baseline",
              alignItems: "baseline",
              m: 1,
              color: "white",
              textShadow: "0 0 8px black",
            }}
          >
            <Typography sx={{ fontSize: "2rem", mr: 1 }}>
              {formatI18n(today, "header.left", lang)}
            </Typography>
            <Typography sx={{ fontSize: "4rem", mr: 1 }}>
              {formatI18n(today, "header.center", lang)}
            </Typography>
            <Typography sx={{ fontSize: "2rem" }}>
              {formatI18n(today, "header.right", lang)}
            </Typography>
          </Box>
          <Calendar
            startOfWeek={startOfWeek}
            holidayList={holidayList}
            targetMonth={currentMonth}
            targetDate={today}
            fontSize={24}
            padding="8px"
            lang={lang}
          />
        </Box>

        <Box sx={{ width: "30%", m: 1, boxSizing: "border-box" }}>
          <Box>
            <Typography
              sx={{
                fontSize: "1.5rem",
                mb: 0,
                color: "white",
                textShadow: "0 0 8px black",
              }}
            >
              {prevMonth.year() !== currentMonth.year()
                ? formatI18n(prevMonth, "prevNextMonth.monthYear", lang)
                : formatI18n(prevMonth, "prevNextMonth.month", lang)}
            </Typography>
            <Calendar
              startOfWeek={startOfWeek}
              holidayList={holidayList}
              targetMonth={prevMonth}
              fontSize={12}
              padding="4px"
              lang={lang}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography
              sx={{
                fontSize: "1.5rem",
                mb: 0,
                color: "white",
                textShadow: "0 0 8px black",
              }}
            >
              {nextMonth.year() !== currentMonth.year()
                ? formatI18n(nextMonth, "prevNextMonth.monthYear", lang)
                : formatI18n(nextMonth, "prevNextMonth.month", lang)}
            </Typography>
            <Calendar
              startOfWeek={startOfWeek}
              holidayList={holidayList}
              targetMonth={nextMonth}
              fontSize={12}
              padding={"4px"}
              lang={lang}
            />
          </Box>
        </Box>
      </Box>
    </div>
  );
};
