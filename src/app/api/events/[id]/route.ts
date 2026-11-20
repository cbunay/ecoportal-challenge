import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { eventService } from "@/sever/event.service";

type EventRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: EventRouteContext) {
  const { id } = await context.params;
  const event = await eventService.getEvent(id);

  if (!event) {
    return NextResponse.json({ errors: ["Event not found"] }, { status: 404 });
  }

  return NextResponse.json(event);
}

export async function PATCH(request: NextRequest, context: EventRouteContext) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const event = await eventService.updateEvent(id, body);

    if (!event) {
      return NextResponse.json(
        { errors: ["Event not found"] },
        { status: 404 },
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          errors: error.issues.map(({ path, message }) => ({ path, message })),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { errors: [error instanceof Error ? error.message : "Invalid event"] },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: EventRouteContext,
) {
  const { id } = await context.params;
  const deleted = await eventService.deleteEvent(id);

  if (!deleted) {
    return NextResponse.json({ errors: ["Event not found"] }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
