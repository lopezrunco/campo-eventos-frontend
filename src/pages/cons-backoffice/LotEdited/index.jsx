import SuccessMessage from "../../../components/SuccessMessage";

function LotEdited() {
  return (
    <SuccessMessage
      title="Lote editado"
      message="El lote ha sido editado con éxito."
      redirectingMessage="Redirigiendo al Mis remates..."
      duration="5000"
      breadcrumbsLocation="Lote editado"
      navigateTo={`/consignatarios/mis-remates`}
    />
  );
}

export default LotEdited;
