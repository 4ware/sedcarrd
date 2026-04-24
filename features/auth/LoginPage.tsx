import LoginLayout from "@/components/layouts/LoginLayout";
import type { FC } from "react";
import LoginForm from "./forms/LoginForm";

const LoginPage: FC = ({}) => {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  )
};

export default LoginPage;
