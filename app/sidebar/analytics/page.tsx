import { ClickEvents } from "@/data-access/clicks"
import { ChartAreaInteractive } from "./chat-area-interactive";
import { ClickEventTypes } from "@/lib/zod/clicks";

export default async function AnalyticsPage() {

  const response = await ClickEvents.getAllClicks({ linkId: 17 });

  return (
    <div>
      <h1>Click Events</h1>
      {response.data && (
        <ChartAreaInteractive clickEvents={groupByDay(response.data)}/>
      )}
      {response.data && JSON.stringify(response.data)}
    </div>
  );
}

function groupByDay(clickEvents: ClickEventTypes.Click[]) {
  const counter = new Map();
  for (const { createdAt } of clickEvents) {
    const day = createdAt.toISOString().split("T")[0];
    counter.set(day, (counter.get(day) || 0) + 1);
  }

  const result = [];
  for (const [day, count] of counter) result.push({ day, count });
  return result;
}
