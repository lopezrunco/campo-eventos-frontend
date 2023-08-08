import SuccessMessage from "../../../components/SuccessMessage";

function LiveEventDeleted() {
  return (
    <SuccessMessage
      title="Remate en vivo borrado"
      message="El remate ha sido borrado exitosamente."
      redirectingMessage="Redirigiendo a Listado de remates en vivo..."
      duration="5000"
      breadcrumbsLocation="Remate en vivo borrado"
      navigateTo="/admin/remates-vivo"
    />
  );
}

export default LiveEventDeleted;
