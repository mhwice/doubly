import { getData } from "@/data-access/urls";
import { InputForm } from "./url-form";

export default function Page() {
  const data = getData();
  return (
    <>
      {data}
      <InputForm />
    </>
  );
}
