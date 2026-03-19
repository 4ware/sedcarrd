import type { FC } from "react";

interface LogoProps {
  propName: type;
}

export const Logo: FC<LogoProps> = ({ propName }) => {
  return <div>Logo</div>;
};
