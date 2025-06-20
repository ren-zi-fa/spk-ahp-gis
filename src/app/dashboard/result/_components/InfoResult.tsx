// components/CalculationInfo.tsx
"use client";

interface CalculationInfoProps {
  lamdaMax: number;
  CI: number;
  RI: number;
  CR: number;
  konsistensi: string;
}

export default function CalculationInfo({
  lamdaMax,
  CI,
  RI,
  CR,
  konsistensi,
}: CalculationInfoProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
      <div>
        <strong>λ Max:</strong> {lamdaMax.toFixed(4)}
      </div>
      <div>
        <strong>CI:</strong> {CI.toFixed(4)}
      </div>
      <div>
        <strong>RI:</strong> {RI.toFixed(4)}
      </div>
      <div>
        <strong>CR:</strong> {CR.toFixed(4)}
      </div>
      <div>
        <strong>Konsistensi:</strong>{" "}
        {konsistensi === "Konsisten" ? "✅ Konsisten" : "❌ Tidak Konsisten"}
      </div>
    </div>
  );
}
