import { FC } from "react";
import { Button } from "@nextui-org/react";

type TButton = {
  value: string;
  className?: string;
  size: "sm" | "md" | "lg";
  radius: "sm" | "md" | "lg" | "none" | "full";
  href?: string;
  onPress?: () => void;
  onClick?: () => void;
};

export const ButtonGradient: FC<TButton> = ({
  value,
  className,
  size,
  radius,
  href,
  onPress,
  onClick
}) => {
  const handleClick = onClick || onPress;

  return (
    <Button
      as={href ? 'a' : 'button'}
      href={href}
      size={size}
      radius={radius}
      className={`${className} shadow px-5 bg-gradient-to-br from-blue to-green text-white font-medium`}
      onPress={handleClick}
      onClick={handleClick}
    >
      {value}
    </Button>
  );
};