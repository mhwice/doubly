import { Calendar } from "@/components/ui/calendar";
import { DatePickerWithRange } from "./time-window";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-full">
      <DatePickerWithRange />
      {/* <Calendar /> */}
    </div>
  );
}
