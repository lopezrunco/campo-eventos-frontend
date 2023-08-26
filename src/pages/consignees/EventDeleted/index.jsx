import SuccessMessage from "../../../components/SuccessMessage";

function EventDeleted() {
  return (
    <SuccessMessage
      title="Remate eliminado"
      message="El remate ha sido eliminado con éxito."
      redirectingMessage="Redirigiendo a Cartelera..."
      duration="5000"
      breadcrumbsLocation="Remate eliminado"
      navigateTo="/"
    />
  );
}

export default EventDeleted;
