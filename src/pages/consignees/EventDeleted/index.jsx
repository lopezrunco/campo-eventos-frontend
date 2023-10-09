import SuccessMessage from "../../../components/SuccessMessage";

function EventDeleted() {
  return (
    <SuccessMessage
      title="Remate eliminado"
      message="El remate ha sido eliminado con éxito."
      redirectingMessage="Redirigiendo a Cartelera..."
      duration="3000"
      breadcrumbsLocation="Remate eliminado"
      navigateTo="/consignatarios/mis-remates"
    />
  );
}

export default EventDeleted;