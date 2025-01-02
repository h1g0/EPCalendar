import { CalendarPage } from "@/components/CalendarPage";
import React from "react";

export default async function Calendar({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { start = "monday", lang = "en" } = await searchParams;
  const startOfWeek = start === "sunday" ? "sunday" : "monday";
  const language = lang === "ja" ? "ja" : "en";
  return <CalendarPage startOfWeek={startOfWeek} lang={language} />;
}
