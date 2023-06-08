import React, { useState } from "react";

import RefuseAcceptPreoffer from "./components/RefuseAcceptPreoffer";
import DeletePreofferModal from "./components/DeletePreofferModal";
import UserDetails from "./components/UserDetails";

function PreoffersList({ preoffers }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <React.Fragment>
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
                          <RefuseAcceptPreoffer preoffer={preoffer} />
                        </td>
                        <td>
                          <UserDetails userId={preoffer.userId} />
                        </td>
                        <td>
                          <i
                            className="fas fa-times"
                            id="nav-close"
                            onClick={handleDeleteModal}
                          ></i>
                          {showDeleteModal ? (
                            <DeletePreofferModal
                              preofferId={preoffer.id}
                              closeFunction={handleDeleteModal}
                            />
                          ) : null}
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
    </React.Fragment>
  );
}

export default PreoffersList;
