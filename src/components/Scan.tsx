import React from "react";

export default function Scan({ children }: { children: React.ReactNode }) {
  const refDom = React.useRef<HTMLDivElement>(null);
  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    console.log(target)
    if (target.classList.contains('child')) {
      console.log('点击的子元素内容:', target.textContent);
      alert(`点击的子元素内容: ${target.textContent}`);
    }
    setTarget(target);
  };

  return (
    <div ref={refDom} onClick={handleClick} style={{ position: "relative" }}>
      {children}
      {target && <FocusBox target={target}/>}
    </div>
  );
}

function FocusBox({ target }: { target: HTMLElement | null }) {
  if (!target) return null;

  const rect = target.getBoundingClientRect();
  const style = {
    position: 'absolute',
    top: `${target.offsetTop}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    border: '1px solid red',
    pointerEvents: 'none'
  };

  return <div style={style}></div>;
}