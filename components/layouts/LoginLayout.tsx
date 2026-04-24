import type { FC } from 'react';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default LoginLayout;
