import SuccessMessage from "../../../components/SuccessMessage";

function LiveEventUpdated() {
  return (
    <SuccessMessage
      title="¡Exito!"
      message="El remate ha sido actualizado exitosamente."
      redirectingMessage="Redirigiendo a Listado de remates en vivo..."
      duration="5000"
      breadcrumbsLocation="Remate en vivo actualizado"
      navigateTo="/admin/remates-vivo"
    />
  );
}

export default LiveEventUpdated;
