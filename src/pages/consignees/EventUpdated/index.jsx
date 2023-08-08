import SuccessMessage from "../../../components/SuccessMessage";

function EventUpdated() {
  return (
    <SuccessMessage
      title="Remate editado"
      message="El remate ha sido editado con éxito."
      redirectingMessage="Redirigiendo a Mis remates..."
      duration="5000"
      breadcrumbsLocation="Remate editado"
      navigateTo="/consignatarios/mis-remates"
    />
  );
}

export default EventUpdated;
