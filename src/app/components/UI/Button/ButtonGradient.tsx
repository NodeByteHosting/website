import { FC, useContext } from "react";
import { Button } from "@nextui-org/react";

type TButton = {
  value: string;
  className?: string;
  size: "sm" | "md" | "lg";
  radius: "sm" | "md" | "lg" | "none" | "full";
  href?: string;
};

export const ButtonGradient: FC<TButton> = ({
  value,
  className,
  size,
  radius,
  href
}) => {
  return (
    <Button
      size={size}
      radius={radius}
      className={`${className}  shadow px-5 bg-gradient-to-br from-blue to-green text-white  font-medium `}
    >
      <a href={href}>{value}</a>
    </Button>
  );
};
