import { Header } from "./header";
import { Card, CardHeader, CardFooter } from "@/components/ui/card"
import Link from "next/link";

export const ErrorCard = () => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label="Oops! Something went wrong!"/>
      </CardHeader>
      <CardFooter>
        <Link className="text-xprimary text-xs font-normal mx-auto p-3" href="/auth/login">Back to login</Link>
      </CardFooter>
    </Card>
  );
}
