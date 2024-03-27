"use client";
import { useEffect, useMemo, useState } from "react";

type PropsType = {
  width?: number;
  height?: number;
  direction?: "left" | "right";
  color?: string;
  filled?: "false" | "true";
  hover?: "false" | "true";
};

export const ArrowCircleIcon = (props: PropsType) => {
  const {
    width = 48,
    height = 48,
    direction = "right",
    color = "white",
    filled = "false",
    hover = "true",
  } = props;
  const base = {
    right:
      "M23.29 17.79C23.1963 17.883 23.1219 17.9936 23.0711 18.1154C23.0203 18.2373 22.9942 18.368 22.9942 18.5C22.9942 18.632 23.0203 18.7627 23.0711 18.8846C23.1219 19.0064 23.1963 19.117 23.29 19.21L26.59 22.5H19C18.7348 22.5 18.4804 22.6054 18.2929 22.7929C18.1054 22.9804 18 23.2348 18 23.5C18 23.7652 18.1054 24.0196 18.2929 24.2071C18.4804 24.3946 18.7348 24.5 19 24.5H26.59L23.29 27.79C23.1017 27.9783 22.9959 28.2337 22.9959 28.5C22.9959 28.7663 23.1017 29.0217 23.29 29.21C23.4783 29.3983 23.7337 29.5041 24 29.5041C24.2663 29.5041 24.5217 29.3983 24.71 29.21L29.71 24.21C29.801 24.1149 29.8724 24.0027 29.92 23.88C29.9729 23.7603 30.0002 23.6309 30.0002 23.5C30.0002 23.3691 29.9729 23.2397 29.92 23.12C29.8724 22.9972 29.801 22.8851 29.71 22.79L24.71 17.79C24.617 17.6963 24.5064 17.6219 24.3846 17.5711C24.2627 17.5203 24.132 17.4942 24 17.4942C23.868 17.4942 23.7373 17.5203 23.6154 17.5711C23.4936 17.6219 23.383 17.6963 23.29 17.79Z",
    left: "M24.71 17.79C24.8037 17.883 24.8781 17.9936 24.9289 18.1154C24.9797 18.2373 25.0058 18.368 25.0058 18.5C25.0058 18.632 24.9797 18.7627 24.9289 18.8846C24.8781 19.0064 24.8037 19.117 24.71 19.21L21.41 22.5H29C29.2652 22.5 29.5196 22.6054 29.7071 22.7929C29.8946 22.9804 30 23.2348 30 23.5C30 23.7652 29.8946 24.0196 29.7071 24.2071C29.5196 24.3946 29.2652 24.5 29 24.5H21.41L24.71 27.79C24.8983 27.9783 25.0041 28.2337 25.0041 28.5C25.0041 28.7663 24.8983 29.0217 24.71 29.21C24.5217 29.3983 24.2663 29.5041 24 29.5041C23.7337 29.5041 23.4783 29.3983 23.29 29.21L18.29 24.21C18.199 24.1149 18.1276 24.0027 18.08 23.88C18.0271 23.7603 17.9998 23.6309 17.9998 23.5C17.9998 23.3691 18.0271 23.2397 18.08 23.12C18.1276 22.9972 18.199 22.8851 18.29 22.79L23.29 17.79C23.383 17.6963 23.4936 17.6219 23.6154 17.5711C23.7373 17.5203 23.868 17.4942 24 17.4942C24.132 17.4942 24.2627 17.5203 24.3846 17.5711C24.5064 17.6219 24.617 17.6963 24.71 17.79Z",
  };
  const colors = useMemo(() => {
    if (filled == "true") {
      return {
        hoverFill: color == "white" ? "black" : "white",
        hoverColor: color,
        fill: color,
        color: color == "white" ? "black" : "white",
        hoverBezelColor: color,
      };
    }
    return {
      hoverFill: color,
      hoverColor: color == "white" ? "black" : "white",
      fill: "none",
      color: color,
      hoverBezelColor: color,
    };
  }, [filled, color]);
  const [hovering, setHovering] = useState(false);
  return (
    <svg
      width={width}
      height={height}
      onMouseOver={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
      fill={hovering && hover == "true" ? colors.hoverFill : colors.fill}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="24"
        cy="24"
        r="23.5"
        transform="matrix(0 -1 -1 0 48 48)"
        stroke={
          hovering && hover == "true" ? colors.hoverBezelColor : colors.color
        }
      />
      <path
        d={base[direction]}
        fill={hovering && hover == "true" ? colors.hoverColor : colors.color}
      />
    </svg>
  );
};
