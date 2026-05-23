import { useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}) {
  const frameRef = useRef(null);
  const [position, setPosition] = useState(50);

  const updatePosition = (clientX) => {
    const frame = frameRef.current;

    if (!frame) return;

    const bounds = frame.getBoundingClientRect();
    const nextPosition = ((clientX - bounds.left) / bounds.width) * 100;

    setPosition(clamp(nextPosition, 4, 96));
  };

  const handlePointerMove = (event) => {
    if (event.buttons !== 1 && event.pointerType === "mouse") return;
    updatePosition(event.clientX);
  };

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updatePosition(event.clientX);
  };

  if (!beforeImage || !afterImage) {
    return null;
  }

  return (
    <div
      ref={frameRef}
      className="relative isolate aspect-[4/3] w-full touch-none overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-black/40"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      role="group"
      aria-label={`${beforeLabel} / ${afterLabel}`}
    >
      <img
        src={beforeImage}
        alt={beforeLabel}
        className="absolute inset-0 h-full w-full select-none object-cover"
        draggable="false"
      />

      <div
        className="absolute inset-0 overflow-hidden transition-[clip-path] duration-75 ease-out"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          className="h-full w-full select-none object-cover"
          draggable="false"
        />
      </div>

      <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-xs font-black uppercase text-white shadow-xl backdrop-blur">
        {beforeLabel}
      </div>

      <div className="absolute right-3 top-3 rounded-full border border-orange-300/30 bg-orange-500 px-3 py-1 text-xs font-black uppercase text-black shadow-xl shadow-orange-500/20">
        {afterLabel}
      </div>

      <div
        className="absolute inset-y-0 z-10 w-px bg-orange-300 shadow-[0_0_28px_rgba(245,162,11,0.75)]"
        style={{ left: `${position}%` }}
      />

      <div
        className="absolute top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-orange-200/70 bg-black/80 shadow-2xl shadow-orange-500/40 backdrop-blur"
        style={{ left: `${position}%` }}
      >
        <span className="h-6 w-1 rounded-full bg-orange-300" />
        <span className="mx-1 h-7 w-px rounded-full bg-white/40" />
        <span className="h-6 w-1 rounded-full bg-orange-300" />
      </div>
    </div>
  );
}
