import { LoginForm } from "./_components/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return <Suspense>
    <LoginForm />
  </Suspense>;
}
