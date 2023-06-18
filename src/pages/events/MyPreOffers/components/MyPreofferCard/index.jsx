import React from "react";

function MyPreofferCard({ preoffer }) {
  return (
    <div className="col-lg-6">
      <div className="border mb-3 p-4">
        <div className="preoffer mb-2">
          <h4 className="my-1">Monto: {preoffer.amount}</h4>
          {preoffer.accepted ? (
            <React.Fragment>
              <span className="acepted">Aceptada</span>
            </React.Fragment>
          ) : (
            <span className="refused">No aceptada</span>
          )}
        </div>
        <a className="button button-light mb-0" href={`/lotes/${preoffer.lotId}`}>
          Ver lote <i className="fas fa-chevron-right ms-2"></i>
        </a>
      </div>
    </div>
  );
}

export default MyPreofferCard;
