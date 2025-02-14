import Image from "next/image";
import { FC } from "react";

type TLogo = {};

export const Logo: FC<TLogo> = ({ }) => {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={70}
      height={70}
      priority={true}
    />
  );
};
