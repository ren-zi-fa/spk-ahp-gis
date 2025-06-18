import ListAnalysis from "./ListAnalysis";
import ModalAnalysis from "./ManagementDataSPK/ModalAnalysis";

export default function InputAlternativesKriteria() {
  return (
    <div className="flex-col p-2">
      <ModalAnalysis />
      <ListAnalysis />
    </div>
  );
}
