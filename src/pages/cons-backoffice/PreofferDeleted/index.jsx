import SuccessMessage from "../../../components/SuccessMessage";

function PreofferDeleted() {
  return (
    <SuccessMessage
      title="Preoferta eliminada"
      message="La preoferta ha sido eliminada con éxito."
      redirectingMessage="Redirigiendo a Mis remates..."
      duration="5000"
      breadcrumbsLocation="Preoferta eliminada"
      navigateTo="/consignatarios/mis-remates"
    />
  );
}

export default PreofferDeleted;
