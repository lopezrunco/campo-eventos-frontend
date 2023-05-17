function PreofferCard({ preoffer }) {
  return (
    <div>
      <p>
        <b>Monto: {preoffer.amount}</b> Fecha: {preoffer.date}{" "}
        {preoffer.accepted ? <span className="tag">Aceptada</span> : null}
      </p>
    </div>
  );
}

export default PreofferCard;
