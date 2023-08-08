import SuccessMessage from "../../../components/SuccessMessage";

function LiveEventCreated() {
  return (
    <SuccessMessage
      title="Remate en vivo creado"
      message="El remate se emitirá el día y hora especificados."
      redirectingMessage="Redirigiendo a Listado de remates en vivo..."
      duration="5000"
      breadcrumbsLocation="Remate en vivo creado"
      navigateTo="/admin/remates-vivo"
    />
  );
}

export default LiveEventCreated;
