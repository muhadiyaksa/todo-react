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
      url: "https://floating-mountain-35184.herokuapp.com/activity-groups",
    }).then((res) => {
      if (res.data.status === "Success") {
        let data = res.data.data.filter((el) => el.email === "muhadiyaksa@gmail.com");
        setActivityArray(data);
        setIsLoading(false);
        setIsSpinner(false);
      }
    });
  };

  const formatTanggal = (param) => {
    const format = new Intl.DateTimeFormat("id-ID", { month: "long" }).format;
    const nameMonth = [...Array(12).keys()].map((m) => format(new Date(Date.UTC(2022, m))));
    console.log(param);
    let data = parseInt(param.split("-")[1]);

    return `${param.split("-")[2]} ${nameMonth[data - 1]} ${param.split("-")[0]}`;
  };

  const checkActivityArray = () => {
    if (activityArray?.length > 0) {
      let result = activityArray.map((el) => {
        return (
          <div class="item row-1 column-3 d-flex flex-column justify-content-between">
            <Button className="judul-activity btn p-0 w-100 h-100 border-0 shadow-none d-inline-flex" type="link" href={`detail/${el.id}`}>
              {el.title}
            </Button>
            <div class="d-flex justify-content-between">
              <span className="waktu-activity">{formatTanggal(el.updated_at.split("T")[0])}</span>
              <button className="btn p-0 shadow-none border-0" id={el.id} title={el.title} onClick={handleShow}>
                <img src={TrashIcon} alt="trash" />
              </button>
            </div>
          </div>
        );
      });
      return result;
    } else {
      return (
        <div class="text-center">
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
    <section className="landingpage">
      <Header />
      <div class="container">
        <div class="subjudul d-flex justify-content-between align-items-center">
          <p>Activity</p>
          <Button isPrimary className="rounded-pill d-inline-flex align-items-center" onClick={addActivity}>
            <span>+ Tambah</span>
            {isSpinner === true ? <span class="lds-dual-ring"></span> : ""}
          </Button>
        </div>
        {isLoading === true ? (
          <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <div class={`${activityArray?.length > 0 ? "container-grid" : ""} hero `}>{checkActivityArray()}</div>
        )}
      </div>

      <ModalElement show={show} size="md">
        <div class="text-center p-4">
          <img src={WarningIcon} alt="" className="mb-5" />
          <p className="fs-5 mb-5">
            Apakah anda yakin menghapus Activity <strong>"{nameActivity}"</strong> ?
          </p>
          <div class="d-flex justify-content-center">
            <Button isPrimary isGray className="rounded-pill me-3" onClick={handleClose}>
              Batal
            </Button>
            <Button isPrimary isRed className="rounded-pill d-inline-flex align-items-center" onClick={deleteActivity}>
              <span>Hapus</span>
              {isSpinnerDelete === true ? <span class="lds-dual-ring"></span> : ""}
            </Button>
          </div>
        </div>
      </ModalElement>
      <ModalElement show={showFinish} size="md" funcModal={handleCloseFinish}>
        <div class="row px-4 align-items-center">
          <div class="col-auto">
            <img src={AlertIcon} alt="" />
          </div>
          <div class="col">
            <p className="fs-5 m-0">Item telah terhapus</p>
          </div>
        </div>
      </ModalElement>
    </section>
  );
}
