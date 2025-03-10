import {
  Children,
  type PropsWithChildren,
  type ReactNode,
  isValidElement,
} from "react";

export function getTextContent(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string") return child;

      if (isValidElement(child)) {
        const children = (child.props as PropsWithChildren | undefined)
          ?.children;

        if (children) {
          return getTextContent(children);
        }
      }

      return "";
    })
    .join("");
}
