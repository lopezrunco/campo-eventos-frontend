import SuccessMessage from "../../../components/SuccessMessage";

function EventCreated() {
  return (
    <SuccessMessage
      title="Remate creado"
      message="El nuevo remate ha sido creado con éxito."
      redirectingMessage="Redirigiendo a Mis remates..."
      duration="5000"
      breadcrumbsLocation="Remate creado"
      navigateTo="/consignatarios/mis-remates"
    />
  );
}

export default EventCreated;
