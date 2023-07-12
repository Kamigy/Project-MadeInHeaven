import React from "react";

type LogoProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export const Logo = (props: LogoProps) => {
  return (
    <img
      src={`${process.env.NEXT_PUBLIC_SCOPE_URL}/logo.png`}
      alt="Miniature cms logo"
      {...props}
    />
  );
};
