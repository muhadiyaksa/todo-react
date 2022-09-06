import React, { useState, useEffect } from "react";
import Header from "../parts/Header";
import Button from "../element/Button";
import ImgHero from "../assets/img/activity-empty-state.png";
import TrashIcon from "../assets/icon/trash.png";
import Axios from "axios";
import ModalElement from "../element/ModalElement";
import WarningIcon from "../assets/icon/warning.png";
import AlertIcon from "../assets/icon/alert.png";

export default function LandingPage() {
  const [activityArray, setActivityArray] = useState([]);
  const [idActivity, setIdActivity] = useState("");
  const [nameActivity, setNameActivity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinner, setIsSpinner] = useState(false);
  const [isSpinnerDelete, setIsSpinnerDelete] = useState(false);
  const [show, setShow] = useState(false);
  const [showFinish, setShowFinish] = useState(false);

  useEffect(() => {
    getDataActivityArray();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    setIdActivity(e.target.getAttribute("id"));
    setNameActivity(e.target.getAttribute("title"));
    setShow(true);
  };
  const handleCloseFinish = () => setShowFinish(false);

  const getDataActivityArray = () => {
    Axios({
      method: "GET",
      url: "https://floating-mountain-35184.herokuapp.com/activity-groups?email=muhadiyaksa@gmail.com",
    }).then((res) => {
      if (res.data.status === "Success") {
        // let data = res.data.data.filter((el) => el.email === "muhadiyaksa@gmail.com");
        setActivityArray(res.data.data);
        setIsLoading(false);
        setIsSpinner(false);
      }
    });
  };

  const formatTanggal = (param) => {
    const format = new Intl.DateTimeFormat("id-ID", { month: "long" }).format;
    const nameMonth = [...Array(12).keys()].map((m) => format(new Date(Date.UTC(2022, m))));
    let data = parseInt(param.split("-")[1]);

    return `${param.split("-")[2]} ${nameMonth[data - 1]} ${param.split("-")[0]}`;
  };

  const checkActivityArray = () => {
    if (activityArray?.length > 0) {
      let result = activityArray.map((el, i) => {
        return (
          <div className="item row-1 column-3 d-flex flex-column justify-content-between" data-cy="activity-item" key={`item-card-${i}`}>
            <Button className="judul-activity btn p-0 w-100 h-100 border-0 shadow-none d-inline-flex" data-cy="activity-item-title" type="link" href={`detail/${el.id}`}>
              {el.title}
            </Button>
            <div className="d-flex justify-content-between">
              <span className="waktu-activity" data-cy="activity-item-date">
                {formatTanggal(el.updated_at.split("T")[0])}
              </span>
              <button className="btn p-0 shadow-none border-0" data-cy="activity-item-delete-button" id={el.id} title={el.title} onClick={handleShow}>
                <img src={TrashIcon} alt="trash" />
              </button>
            </div>
          </div>
        );
      });
      return result;
    } else {
      return (
        <div className="text-center">
          <img src={ImgHero} alt="Hero Image" className="img-fluid mt-5" />
        </div>
      );
    }
  };

  const addActivity = () => {
    setIsSpinner(true);
    Axios({
      method: "POST",
      data: {
        title: "New Activity",
        email: "muhadiyaksa@gmail.com",
      },
      url: "https://floating-mountain-35184.herokuapp.com/activity-groups",
    }).then(() => {
      getDataActivityArray();
    });
  };

  const deleteActivity = () => {
    setIsSpinnerDelete(true);
    Axios({
      method: "DELETE",
      url: `https://floating-mountain-35184.herokuapp.com/activity-groups/${idActivity}`,
    }).then((res) => {
      if (res.data.status === "Success") {
        let data = activityArray.filter((el) => el.id !== parseInt(idActivity));
        setActivityArray(data);
        setShow(false);
        setShowFinish(true);
        setIsSpinnerDelete(false);
      }
    });
  };
  return (
    <>
      <Header />
      <div className="landingpage">
        <div className="container">
          <div className="subjudul d-flex justify-content-between align-items-center">
            <p data-cy="activity-title">Activity</p>
            <Button data-cy="activity-add-button" isPrimary className="rounded-pill d-inline-flex align-items-center" onClick={addActivity}>
              <span>+ Tambah</span>
              {isSpinner === true ? <span className="lds-dual-ring"></span> : ""}
            </Button>
          </div>
          {isLoading === true ? (
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
            <div className={`${activityArray?.length > 0 ? "container-grid" : ""} hero `}>{checkActivityArray()}</div>
          )}
        </div>

        <ModalElement show={show} size="md" data-cy="modal-delete">
          <div className="text-center p-4">
            <img src={WarningIcon} alt="" className="mb-5" data-cy="modal-delete-icon" />
            <p className="fs-5 mb-5" data-cy="modal-delete-title">
              Apakah anda yakin menghapus Activity <strong>"{nameActivity}"</strong> ?
            </p>
            <div className="d-flex justify-content-center">
              <Button isPrimary isGray className="rounded-pill me-3" onClick={handleClose} data-cy="modal-delete-cancel-button">
                Batal
              </Button>
              <Button isPrimary isRed className="rounded-pill d-inline-flex align-items-center" onClick={deleteActivity} data-cy="modal-delete-confirm-button">
                <span>Hapus</span>
                {isSpinnerDelete === true ? <span className="lds-dual-ring"></span> : ""}
              </Button>
            </div>
          </div>
        </ModalElement>
        <ModalElement show={showFinish} size="md" funcModal={handleCloseFinish} data-cy="modal-information">
          <div className="row px-4 align-items-center">
            <div className="col-auto">
              <img src={AlertIcon} alt="" data-cy="modal-information-icon" />
            </div>
            <div className="col">
              <p className="fs-5 m-0" data-cy="modal-information-title">
                Item telah terhapus
              </p>
            </div>
          </div>
        </ModalElement>
      </div>
    </>
  );
}
