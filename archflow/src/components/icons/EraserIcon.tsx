import { getEraserIconUrl } from "@/constants/eraserIcons";
import { cn } from "@/lib/utils";

interface EraserIconProps {
  iconId: string;
  size?: number;
  className?: string;
  alt?: string;
}

export function EraserIcon({
  iconId,
  size = 20,
  className,
  alt,
}: EraserIconProps) {
  return (
    <Image
      src={getEraserIconUrl(iconId)}
      alt={alt ?? iconId}
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      draggable={false}
    />
  );
}
import Image from "next/image";
