import SuccessMessage from "../../../components/SuccessMessage";

function PreOfferEdited() {
  return (
    <SuccessMessage
      title="Preoferta editada"
      redirectingMessage="Redirigiendo a Mis remates..."
      duration="5000"
      breadcrumbsLocation="Preoferta editada"
      navigateTo="/consignatarios/mis-remates"
    />
  );
}

export default PreOfferEdited;
