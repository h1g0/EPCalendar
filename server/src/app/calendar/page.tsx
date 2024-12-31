import { CalendarPage } from "@/components/CalendarPage";
import React from "react";

export default async function Calendar({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { start = 'monday' } = await searchParams;
    const startOfWeek = start === 'sunday' ? 'sunday' : 'monday';
    return <CalendarPage startOfWeek={startOfWeek} />;
}
