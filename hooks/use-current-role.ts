import { CustomUser } from "@/auth";
import { useSession } from "next-auth/react";
export const useCurrentRole = () => {
  const session = useSession();
  return (session.data?.user as CustomUser).role;
};
