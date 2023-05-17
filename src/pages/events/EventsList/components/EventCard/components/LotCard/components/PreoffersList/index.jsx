function PreoffersList({ preoffers }) {
  return (
    <div className="col-12 preoffers-container border p-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            <h3>Preofertas:</h3>
            {preoffers.map((preoffer) => {
              return (
                <p key={preoffer.id}>
                  <b>Monto: {preoffer.amount}</b> {preoffer.date}{" "}
                  {preoffer.accepted ? (
                    <span className="tag">Aceptada</span>
                  ) : null}
                </p>
              );
            })}
          </div>
          <div className="col-lg-3">
            <h3>Hacer Preoferta:</h3>
            <input
              type="number"
              id="quantity"
              min="1"
              placeholder="Ingrese cantidad"
            ></input>
            <a className="button button-light-outline">Preofertar</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreoffersList;
