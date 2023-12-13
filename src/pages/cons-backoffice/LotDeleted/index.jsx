import SuccessMessage from "../../../components/SuccessMessage";

function LotDeleted() {
  return (
    <SuccessMessage
      title="Lote eliminado"
      message="El lote ha sido eliminado con éxito."
      redirectingMessage="Redirigiendo a Mis remates..."
      duration="5000"
      breadcrumbsLocation="Lote eliminado"
      navigateTo="/consignatarios/mis-remates"
    />
  );
}

export default LotDeleted;
