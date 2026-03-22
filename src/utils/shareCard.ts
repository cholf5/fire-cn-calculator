import { formatCurrency, formatPercent } from "./format";

interface ShareCardData {
  recommendedTarget: number;
  baseTarget: number;
  longevityTarget: number;
  annualExpense: number;
  safetyLabel: string;
  realReturn: number;
  cityTierLabel: string;
  hasHouse: boolean;
}

function drawMetric(
  context: CanvasRenderingContext2D,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
) {
  context.fillStyle = "rgba(255, 255, 255, 0.08)";
  context.fillRect(x, y, width, 112);

  context.fillStyle = "rgba(236, 240, 236, 0.72)";
  context.font = '500 24px "IBM Plex Sans", "Noto Sans SC", sans-serif';
  context.fillText(label, x + 24, y + 34);

  context.fillStyle = "#f9f5ec";
  context.font = '700 34px "IBM Plex Sans", "Noto Sans SC", sans-serif';
  context.fillText(value, x + 24, y + 78);
}

export async function createShareCardBlob(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("canvas context unavailable");
  }

  const background = context.createLinearGradient(0, 0, 1200, 630);
  background.addColorStop(0, "#143f3a");
  background.addColorStop(1, "#0b2328");
  context.fillStyle = background;
  context.fillRect(0, 0, 1200, 630);

  const glow = context.createLinearGradient(0, 0, 1200, 0);
  glow.addColorStop(0, "rgba(247, 177, 76, 0.28)");
  glow.addColorStop(1, "rgba(111, 208, 189, 0.22)");
  context.fillStyle = glow;
  context.fillRect(48, 44, 1104, 542);

  context.fillStyle = "#f0ba68";
  context.font = '600 24px "IBM Plex Sans", "Noto Sans SC", sans-serif';
  context.fillText("FIRE CN Calculator", 76, 94);

  context.fillStyle = "#f9f5ec";
  context.font = '700 72px "IBM Plex Sans", "Noto Sans SC", sans-serif';
  context.fillText("推荐准备资产", 72, 174);
  context.font = '700 88px "IBM Plex Sans", "Noto Sans SC", sans-serif';
  context.fillText(formatCurrency(data.recommendedTarget), 72, 276);

  context.fillStyle = "rgba(236, 240, 236, 0.78)";
  context.font = '500 28px "IBM Plex Sans", "Noto Sans SC", sans-serif';
  context.fillText(
    `${data.cityTierLabel}城市 · ${data.hasHouse ? "有房" : "无房"} · 安全等级 ${data.safetyLabel}`,
    76,
    332,
  );

  drawMetric(context, "基础估算", formatCurrency(data.baseTarget), 72, 382, 332);
  drawMetric(context, "长期覆盖建议", formatCurrency(data.longevityTarget), 434, 382, 332);
  drawMetric(context, "年支出", formatCurrency(data.annualExpense), 796, 382, 332);

  context.fillStyle = "rgba(236, 240, 236, 0.72)";
  context.font = '500 24px "IBM Plex Sans", "Noto Sans SC", sans-serif';
  context.fillText(`实际收益率 ${formatPercent(data.realReturn, 2)}`, 76, 550);
  context.textAlign = "right";
  context.fillText("已综合退休年限与未来支出增长口径", 1124, 550, 336);
  context.textAlign = "start";

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((nextBlob) => resolve(nextBlob), "image/png");
  });

  if (!blob) {
    throw new Error("share card generation failed");
  }

  return blob;
}
