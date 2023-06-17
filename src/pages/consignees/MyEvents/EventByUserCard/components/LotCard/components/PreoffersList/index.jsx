import React, { useState } from "react";

import RefuseAcceptPreoffer from "./components/RefuseAcceptPreoffer";
import DeletePreofferModal from "./components/DeletePreofferModal";
import UserDetails from "./components/UserDetails";

function PreoffersList({ preoffers, currency }) {
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
              <h3>Preofertas ({currency}):</h3>
              {preoffers.map((preoffer) => {
                return (
                  <div key={preoffer.id} className="preoffer">
                    <span>{preoffer.amount}</span>
                    <RefuseAcceptPreoffer preoffer={preoffer} />
                    <UserDetails userId={preoffer.userId} />
                    <span role="button" onClick={handleDeleteModal}>
                      Eliminar
                      <i className="ms-2 fas fa-times" id="nav-close"></i>
                      {showDeleteModal ? (
                        <DeletePreofferModal
                          preofferId={preoffer.id}
                          closeFunction={handleDeleteModal}
                        />
                      ) : null}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default PreoffersList;
