import { CalendarPage } from "@/components/CalendarPage";
import dayjs from "dayjs";
import React from "react";

export default async function Calendar({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { date, start = "monday", lang = "en" } = await searchParams;
  let showDate = dayjs();
  if (date && typeof date === "string" && dayjs(date).isValid()) {
    showDate = dayjs(date);
  }
  const startOfWeek = start === "sunday" ? "sunday" : "monday";
  const language = lang === "ja" ? "ja" : "en";
  return <CalendarPage
    startOfWeek={startOfWeek}
    lang={language}
    date={showDate}
  />;
}
