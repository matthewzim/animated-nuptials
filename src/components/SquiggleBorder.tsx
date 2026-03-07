interface SquiggleBorderProps {
  className?: string;
  color?: string;
  strokeWidth?: number;
  loopSize?: number;
}

export const SquiggleBorder = ({
  className = "",
  color = "#2a5a8a",
  strokeWidth = 2.5,
  loopSize = 14,
}: SquiggleBorderProps) => {
  // Generate a looping squiggle path along one edge
  // Each "loop" is a small circle/arc protruding outward
  const generateLoopPath = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    outwardDirection: "up" | "down" | "left" | "right"
  ) => {
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const numLoops = Math.floor(length / (loopSize * 2));
    const stepX = dx / (numLoops * 2);
    const stepY = dy / (numLoops * 2);

    let path = "";
    const r = loopSize * 0.7;

    for (let i = 0; i < numLoops; i++) {
      const x1 = startX + stepX * (i * 2);
      const y1 = startY + stepY * (i * 2);
      const x2 = startX + stepX * (i * 2 + 1);
      const y2 = startY + stepY * (i * 2 + 1);
      const x3 = startX + stepX * (i * 2 + 2);
      const y3 = startY + stepY * (i * 2 + 2);

      // Create a loop using cubic bezier curves
      let cx1: number, cy1: number, cx2: number, cy2: number;

      switch (outwardDirection) {
        case "up":
          cx1 = x1 + (x2 - x1) * 0.3;
          cy1 = y1 - r * 1.8;
          cx2 = x2 + (x3 - x2) * 0.7;
          cy2 = y2 - r * 1.8;
          break;
        case "down":
          cx1 = x1 + (x2 - x1) * 0.3;
          cy1 = y1 + r * 1.8;
          cx2 = x2 + (x3 - x2) * 0.7;
          cy2 = y2 + r * 1.8;
          break;
        case "left":
          cx1 = x1 - r * 1.8;
          cy1 = y1 + (y2 - y1) * 0.3;
          cx2 = x2 - r * 1.8;
          cy2 = y2 + (y3 - y2) * 0.7;
          break;
        case "right":
          cx1 = x1 + r * 1.8;
          cy1 = y1 + (y2 - y1) * 0.3;
          cx2 = x2 + r * 1.8;
          cy2 = y2 + (y3 - y2) * 0.7;
          break;
      }

      path += `C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x3} ${y3} `;
    }

    return path;
  };

  // Padding to allow loops to extend outside without clipping
  const pad = loopSize * 2;
  const viewW = 400;
  const viewH = 600;
  const innerLeft = pad;
  const innerTop = pad;
  const innerRight = viewW - pad;
  const innerBottom = viewH - pad;

  const topPath = generateLoopPath(innerLeft, innerTop, innerRight, innerTop, "up");
  const rightPath = generateLoopPath(innerRight, innerTop, innerRight, innerBottom, "right");
  const bottomPath = generateLoopPath(innerRight, innerBottom, innerLeft, innerBottom, "down");
  const leftPath = generateLoopPath(innerLeft, innerBottom, innerLeft, innerTop, "left");

  const fullPath = `M ${innerLeft} ${innerTop} ${topPath} ${rightPath} ${bottomPath} ${leftPath} Z`;

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={fullPath}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
