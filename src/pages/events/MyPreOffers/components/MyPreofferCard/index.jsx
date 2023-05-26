import React from "react";

function MyPreofferCard({ preoffer }) {
  return (
    <div className="col-lg-4">
      <div className="border mb-3 p-4">
        <h3>Monto: {preoffer.amount}</h3>
        <p>Fecha: {preoffer.date}</p>
        {preoffer.accepted ? (
          <React.Fragment>
            <span className="tag acepted-preoffer">Aceptada</span>
            <br />
            <br />
            <small>
              El consignatario se pondrá en contacto con usted mediante las viás
              de contacto facilitadas.
            </small>
          </React.Fragment>
        ) : (
          <span className="tag refused-preoffer">No aceptada</span>
        )}
        <p>
          <a className="button button-light" href={`/lotes/${preoffer.lotId}`}>
            Ver lote
          </a>
        </p>
      </div>
    </div>
  );
}

export default MyPreofferCard;
