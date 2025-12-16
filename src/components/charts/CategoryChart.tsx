import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  HistogramSeries,
  type ISeriesApi,
  type HistogramData,
  type Time,
} from "lightweight-charts";
import { css } from "../../utils/cssUtil";

export type CategoryPoint = {
  category: string;
  value: number;
};

type Props = {
  height?: number;
  dataActual: CategoryPoint[];
  dataProjected?: CategoryPoint[];
};

/* Convert categories → indexed time */
function toIndexed(data: CategoryPoint[]): HistogramData[] {
  const baseDate = new Date("2025-01-01");
  return data.map((d, idx) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + idx);
    const timeStr = date.toISOString().split("T")[0];
    return { time: timeStr as Time, value: d.value };
  });
}

/* Time formatter helper */
const timeToDateStr = (time: Time): string => {
  if (typeof time === "string") return time;
  if (typeof time === "number")
    return new Date(time * 1000).toISOString().split("T")[0];

  const bd = time as { year: number; month: number; day: number };
  return `${bd.year}-${String(bd.month).padStart(2, "0")}-${String(bd.day).padStart(2, "0")}`;
};

const CategoryChart = ({
  height = 300,
  dataActual,
  dataProjected = [],
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRefs = useRef<Record<string, ISeriesApi<"Histogram">>>({});

  useEffect(() => {
    if (!containerRef.current) return;

    /* Category label mapping */
    const categoryMapFull = new Map<string, string>();
    const categoryMapShort = new Map<string, string>();
    const baseDate = new Date("2025-01-01");

    dataActual.forEach((d, idx) => {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + idx);
      const key = date.toISOString().split("T")[0];

      categoryMapFull.set(key, d.category);
      categoryMapShort.set(
        key,
        d.category.length > 12 ? `${d.category.slice(0, 12)}…` : d.category
      );
    });

    /* Create chart */
    const chart = createChart(containerRef.current, {
      autoSize: true,
      height,

      layout: {
        background: {
          type: ColorType.Solid,
          color: css("--background-secondary", "#0f172a"),
        },
        textColor: css("--text-secondary", "#d1d5db"),
      },

      grid: {
        vertLines: {
          color: "rgba(255,255,255,0.04)",
        },
        horzLines: {
          color: "rgba(255,255,255,0.04)",
        },
      },

      localization: {
        timeFormatter: (time: Time) => {
          const t = timeToDateStr(time);
          return categoryMapFull.get(t) ?? t;
        },
      },

      timeScale: {
        barSpacing: 42,
        minBarSpacing: 20,
        tickMarkMaxCharacterLength: 12,
        tickMarkFormatter: (time: Time) => {
          const t = timeToDateStr(time);
          return categoryMapShort.get(t) ?? t;
        },
      },

      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.08)",
      },
    });

    chartRef.current = chart;

    /* Actual data (primary / income-style) */
    const actual = chart.addSeries(HistogramSeries);
    actual.applyOptions({
      color: "#4ade80",
      priceFormat: { type: "volume" },
    });
    actual.setData(toIndexed(dataActual));
    seriesRefs.current.actual = actual;

    /* Projected data (muted / accent) */
    if (dataProjected.length > 0) {
      const projected = chart.addSeries(HistogramSeries);
      projected.applyOptions({
        color: "#60a5fa",
        priceFormat: { type: "volume" },
      });
      projected.setData(toIndexed(dataProjected));
      seriesRefs.current.projected = projected;
    }

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRefs.current = {};
    };
  }, [height, dataActual, dataProjected]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        position: "relative",
      }}
    />
  );
};

export default CategoryChart;
