import type { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <section className="h-screen w-screen flex flex-row">
      <div className="w-1/2 h-screen bg-amber-200">r</div>
      <div className="h-screen w-1/2 flex items-center justify-center">
        {children}
      </div>
    </section>
  );
};

export default AuthLayout;
