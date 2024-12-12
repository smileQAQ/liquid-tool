import React from "react";
import { observer } from "mobx-react-lite";
import { useMainStore } from "./mainProvider";

export function Scan({ children }: { children: React.ReactNode }) {
  const counterStore = useMainStore();
  const refDom = React.useRef<HTMLDivElement>(null);
  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.attributes.getNamedItem("data-sid")) {
      const allElements = refDom.current?.querySelectorAll("[data-sid]");
      const index = Array.from(allElements || []).indexOf(target);
      console.log(index);
      counterStore.setSelectIndex = index;
      setTarget(target);
    } else {
      counterStore.setSelectIndex = -1;
      setTarget(null);
    }
  };

  return (
    <div ref={refDom} onClick={handleClick} style={{ position: "relative" }}>
      {children}
      {target && <FocusBox target={target} />}
    </div>
  );
}

function FocusBox({ target }: { target: HTMLElement | null }) {
  if (!target) return null;

  const rect = target.getBoundingClientRect();
  const style = {
    position: "absolute" as const,
    top: `${target.offsetTop}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    border: "1px solid red",
    pointerEvents: "none" as const,
  };

  return <div style={style}></div>;
}

const ObservedScan = observer(Scan);
export default ObservedScan;
