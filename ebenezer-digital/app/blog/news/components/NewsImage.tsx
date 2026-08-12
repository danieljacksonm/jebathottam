"use client";

import Image, { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "src"> & { src: string };

export function NewsImage({ src, alt, ...rest }: Props) {
  const remote = src.startsWith("http://") || src.startsWith("https://");
  return <Image src={src} alt={alt} unoptimized={remote} {...rest} />;
}
