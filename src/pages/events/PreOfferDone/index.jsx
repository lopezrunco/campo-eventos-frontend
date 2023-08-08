import SuccessMessage from "../../../components/SuccessMessage";

function PreOfferDone() {
  return (
    <SuccessMessage
      title="¡Exito!"
      message="Su preoferta a sido realizada correctamente."
      redirectingMessage="Redirigiendo a Remates..."
      duration="5000"
      breadcrumbsLocation="Preoferta realizada"
      navigateTo="/remates"
    />
  );
}

export default PreOfferDone;
