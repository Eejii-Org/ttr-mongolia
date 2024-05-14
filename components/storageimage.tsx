import Image, { ImageProps } from "next/image";

interface StorageImageProps extends ImageProps {
  noPrefix?: boolean;
}

export const StorageImage = (props: StorageImageProps) => {
  const { src, noPrefix = false, ...rest } = props;
  const prefix = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";
  const prefixedSrc = `${prefix}/${src}`;
  return <Image src={noPrefix ? src : prefixedSrc} {...rest} />;
};

export default StorageImage;
