import { useParams } from "react-router-dom";
import SuccessMessage from "../../../components/SuccessMessage";

function LotCreated() {
  const { id } = useParams();
  
  return (
    <SuccessMessage
      title="Lote creado"
      message="El nuevo lote ha sido creado con éxito."
      redirectingMessage="Redirigiendo al remate..."
      duration="5000"
      breadcrumbsLocation="Lote creado"
      navigateTo={`/consignatarios/mis-remates/${id}`}
    />
  );
}

export default LotCreated;
