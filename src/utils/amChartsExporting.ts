import * as am5 from "@amcharts/amcharts5";
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";

export function setupChartExporting(root: am5.Root): am5exporting.Exporting {
  return am5exporting.Exporting.new(root, {
    menu: undefined,
    filePrefix: "Haycarb_Chart",
    backgroundColor: am5.color(0xffffff),
    pdfOptions: {
      addURL: false,
    },
  });
}
