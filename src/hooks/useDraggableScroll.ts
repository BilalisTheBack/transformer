import { useRef, useState, useCallback } from "react";

export function useDraggableScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [dragged, setDragged] = useState(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const element = ref.current;
    if (!element) return;

    setIsMouseDown(true);
    setStartX(e.pageX - element.offsetLeft);
    setScrollLeft(element.scrollLeft);
    setDragged(0);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const onMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isMouseDown) return;

      const element = ref.current;
      if (!element) return;

      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier

      if (Math.abs(walk) > 5) {
        setDragged(Math.abs(walk));
      }

      element.scrollLeft = scrollLeft - walk;
    },
    [isMouseDown, startX, scrollLeft]
  );

  const onClickCapture = useCallback(
    (e: React.MouseEvent) => {
      if (dragged > 5) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    [dragged]
  );

  return {
    ref,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
    onClickCapture,
    isMouseDown,
  };
}
