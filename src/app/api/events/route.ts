import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { InvalidEventError } from "@/sever/event.schema";
import { eventService } from "@/sever/event.service";

function errorResponse(error: unknown, fallback: string, status = 400) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        errors: error.issues.map(({ path, message }) => ({ path, message })),
      },
      { status: 400 },
    );
  }

  if (error instanceof InvalidEventError) {
    return NextResponse.json({ errors: error.errors }, { status: 400 });
  }

  return NextResponse.json(
    { errors: [error instanceof Error ? error.message : fallback] },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const start = searchParams.get("start") ?? undefined;
  const end = searchParams.get("end") ?? undefined;

  try {
    const events = await eventService.getEvents(start, end);

    return NextResponse.json(events);
  } catch (error) {
    return errorResponse(error, "Failed to retrieve events", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = await eventService.createEvent(body);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return errorResponse(error, "Invalid event");
  }
}
