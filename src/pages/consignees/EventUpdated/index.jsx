import SuccessMessage from "../../../components/SuccessMessage";

function EventUpdated() {
  return (
    <SuccessMessage
      title="Remate editado"
      message="El remate ha sido editado con éxito."
      redirectingMessage="Redirigiendo a Cartelera..."
      duration="5000"
      breadcrumbsLocation="Remate editado"
      navigateTo="/"
    />
  );
}

export default EventUpdated;
