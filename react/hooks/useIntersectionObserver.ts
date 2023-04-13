import { useCallback, useRef } from "react";
import { throttle } from "lodash";

export interface Props {
  callback: () => void;
  root?: HTMLDivElement | null;
}

export const useIntersectionObserver = <T extends HTMLElement>({
  callback,
  root,
}: Props) => {
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const throttlingCallback = useRef(throttle(() => callback(), 1500));
  const targetRef = useCallback(
    (node: T) => {
      if (intersectionObserverRef.current)
        intersectionObserverRef.current?.disconnect();
      intersectionObserverRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            throttlingCallback.current();
          }
        },
        {
          root,
          rootMargin: "0px",
        }
      );
      if (node) intersectionObserverRef.current?.observe(node);
    },
    [callback]
  );

  return targetRef;
};
