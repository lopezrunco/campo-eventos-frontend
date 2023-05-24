import UserDetails from "./components/UserDetails";

function PreoffersList({ preoffers }) {
  return (
    <div className="col-12 preoffers-container border p-4">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h3>Preofertas:</h3>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Monto</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Estado</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {preoffers.map((preoffer) => {
                  return (
                    <tr key={preoffer.id}>
                      <td>{preoffer.amount}</td>
                      <td>{preoffer.date}</td>
                      <td>
                        {preoffer.accepted ? (
                          <span className="tag">Aceptada</span>
                        ) : (
                          <span className="tag">No aceptada</span>
                        )}
                      </td>
                      <td>
                        <UserDetails userId={preoffer.userId} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreoffersList;
