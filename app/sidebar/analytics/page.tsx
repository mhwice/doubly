import { ClickEvents } from "@/data-access/clicks"
import { ChartAreaInteractive } from "./chat-area-interactive";
import { ClickEventTypes } from "@/lib/zod/clicks";
import { getSession } from "@/lib/get-session";

export default async function AnalyticsPage() {

  const session = await getSession();
  if (!session) throw new Error();
  const { id } = session.user;
  const response = await ClickEvents.getAllClicks({ userId: id });

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

// function groupByDay(clickEvents: ClickEventTypes.Click[]) {
//   const qrCounter = new Map();
//   const linksCounter = new Map();
//   for (const { createdAt, source } of clickEvents) {
//     const day = createdAt.toISOString().split("T")[0];
//     qrCounter.set(day, (qrCounter.get(day) || 0) + (source === "qr" ? 1 : 0));
//     linksCounter.set(day, (linksCounter.get(day) || 0) + (source === "link" ? 1 : 0));
//   }

//   const result = [];
//   for (const day of qrCounter.keys()) {
//     result.push({ day, qr: qrCounter.get(day), link: linksCounter.get(day) });
//   }

//   result.sort((a, b) => new Date(a.day) - new Date(b.day))

//   return result;
// }

function groupByDay(clickEvents: ClickEventTypes.Click[]) {
  const qrCounter = new Map<string, number>();
  const linksCounter = new Map<string, number>();

  for (const { createdAt, source } of clickEvents) {
    const day = createdAt.toISOString().split("T")[0];
    qrCounter.set(day, (qrCounter.get(day) || 0) + (source === "qr" ? 1 : 0));
    linksCounter.set(day, (linksCounter.get(day) || 0) + (source === "link" ? 1 : 0));
  }

  const result: { day: string; qr: number; link: number }[] = [];
  for (const day of qrCounter.keys()) {
    result.push({
      day,
      qr: qrCounter.get(day) || 0,
      link: linksCounter.get(day) || 0,
    });
  }

  result.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

  return result;
}
