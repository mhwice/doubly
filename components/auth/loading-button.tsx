import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps {
  loading: boolean,
  children: React.ReactNode,
}

export const LoadingButton = ({ loading, children }: LoadingButtonProps) => {
  return (
    <Button variant="flat" disabled={loading} type="submit" className="w-full">
      {loading && <Loader2 className="animate-spin"/>}
      {children}
    </Button>
  );
};
