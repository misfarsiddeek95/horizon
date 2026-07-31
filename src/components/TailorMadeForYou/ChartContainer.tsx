import { forwardRef } from "react";

interface ChartContainerProps {
  className?: string;
}

const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] ${className}`}
      />
    );
  }
);

ChartContainer.displayName = "ChartContainer";

export default ChartContainer;
