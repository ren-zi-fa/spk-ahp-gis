"use client";

interface CalculationInfoProps {
  lamdaMax: number;
  CI: number;
  CR: number;
  konsistensi: string;
}


export default function CalculationInfo({
  lamdaMax,
  CI,
  CR,
  konsistensi,
}: CalculationInfoProps) {
  return (
    <div className="grid grid-cols-2 my-3 px-2 md:grid-cols-3 gap-2 text-sm">
      <div>
        <strong>λ Max:</strong> {lamdaMax.toFixed(4)}
      </div>
      <div>
        <strong>CI:</strong> {CI.toFixed(4)}
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
