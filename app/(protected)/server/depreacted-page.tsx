import { UserInfo } from "@/components/deprecated-user-info";
import { currentUser } from "@/lib/depreacted-auth";

export default async function ServerPage() {
  const user = await currentUser();
  return (
    <UserInfo label="Server component" user={user} />
  );
}
