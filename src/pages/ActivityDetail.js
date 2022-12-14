import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../parts/Header";
import Button from "../element/Button";
import BackIcon from "../assets/icon/back.png";
import PencilIcon from "../assets/icon/pencil.png";
import WarningIcon from "../assets/icon/warning.png";
import AlertIcon from "../assets/icon/alert.png";
import ImgDetail from "../assets/img/todo-empty-state.png";
import TrashIcon from "../assets/icon/trash.png";
import UrutkanIcon from "../assets/icon/urutkan.png";
import ModalElement from "../element/ModalElement";
import Select from "react-select";
import Axios from "axios";
export default function ActivityDetail() {
  const [isActive, setIsActive] = useState("");
  const [todoArray, settodoArray] = useState([]);
  const [todoArrayFilter, settodoArrayFilter] = useState([]);
  const [valueName, setValueName] = useState("");
  const [nameToDo, setNameToDo] = useState("");
  const [idToDo, setIdToDo] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [isLoadingToDo, setIsLoadingToDo] = useState(true);
  const [isSpinner, setIsSpiner] = useState(false);
  const [isSpinnerDelete, setIsSpinerDelete] = useState(false);

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const [showFilter, setShowFilter] = useState("d-none");
  const param = useParams();

  useEffect(() => {
    getDataActivity();
    getDataAllToDo();
  }, []);

  const divCircleColorOption = (param, kondisi, kondisi2) => {
    if (param === "very-high") {
      return (
        <div className={`d-flex ${kondisi2 === true ? "px-3 py-2" : ""} align-items-center`} data-cy="todo-item-priority-indicator">
          <span className="circle red"></span>
          <span className={kondisi}>Very High</span>
        </div>
      );
    } else if (param === "high") {
      return (
        <div className={`d-flex ${kondisi2 === true ? "px-3 py-2" : ""} align-items-center`} data-cy="todo-item-priority-indicator">
          <span className="circle orange"></span>
          <span className={kondisi}>High</span>
        </div>
      );
    } else if (param === "normal") {
      return (
        <div className={`d-flex ${kondisi2 === true ? "px-3 py-2" : ""} align-items-center`} data-cy="todo-item-priority-indicator">
          <span className="circle green"></span>
          <span className={kondisi}>Medium</span>
        </div>
      );
    } else if (param === "low") {
      return (
        <div className={`d-flex ${kondisi2 === true ? "px-3 py-2" : ""} align-items-center`} data-cy="todo-item-priority-indicator">
          <span className="circle blue"></span>
          <span className={kondisi}>Low</span>
        </div>
      );
    } else if (param === "very-low") {
      return (
        <div className={`d-flex ${kondisi2 === true ? "px-3 py-2" : ""} align-items-center`} data-cy="todo-item-priority-indicator">
          <span className="circle purple"></span>
          <span className={kondisi}>Very Low</span>
        </div>
      );
    }
  };
  const options = [
    { value: "very-high", label: divCircleColorOption("very-high", "", true) },
    { value: "high", label: divCircleColorOption("high", "", true) },
    { value: "normal", label: divCircleColorOption("normal", "", true) },
    { value: "low", label: divCircleColorOption("low", "", true) },
    { value: "very-low", label: divCircleColorOption("very-low", "", true) },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const getDataActivity = () => {
    Axios({
      method: "GET",
      url: `https://todo.api.devcode.gethired.id/activity-groups/${param.id}`,
    }).then((res) => {
      if (res.data.status === "Success") {
        setValueName(res.data.data.title);
        setIsLoadingActivity(false);
      }
    });
  };

  const getDataAllToDo = () => {
    Axios({
      method: "GET",
      url: `https://todo.api.devcode.gethired.id/todo-items?activity_group_id=${param.id}`,
    }).then((res) => {
      if (res.data.status === "Success") {
        settodoArray(res.data.data);
        setIsLoadingToDo(false);
        setIsSpiner(false);
      }
    });
  };

  const createToDo = () => {
    setIsSpiner(true);

    if (isUpdate === true) {
      Axios({
        method: "PATCH",
        data: {
          activity_group_id: param.id,
          title: nameToDo,
          priority: selectedOption.value,
        },
        url: `https://todo.api.devcode.gethired.id/todo-items/${idToDo}`,
      }).then((res) => {
        getDataAllToDo();

        setShow(false);
      });
    } else {
      Axios({
        method: "POST",
        data: {
          activity_group_id: param.id,
          title: nameToDo,
          priority: selectedOption.value,
        },
        url: "https://todo.api.devcode.gethired.id/todo-items",
      }).then((res) => {
        if (res.data.status === "Success") {
          getDataAllToDo();
          setShow(false);
          // setShowFinish(true);
        }
      });
    }
  };

  const hiddenForm = (e) => {
    setIsActive("");
    updateNameActivity();
  };

  const updateNewJudul = () => {
    console.log(isActive);
    if (isActive === "form") {
      setIsActive("");
    } else {
      setIsActive("form");
    }
  };

  const handleCloseNotif = () => {
    setShow(false);
  };
  const handleShowNotif = (e) => {
    if (e.target.classList.contains("update-todo")) {
      setSelectedOption({ value: e.target.getAttribute("priority") });
      setNameToDo(e.target.getAttribute("title"));
      setIdToDo(e.target.getAttribute("id"));
      setIsUpdate(true);
    } else {
      setSelectedOption({ value: "very-high" });
      setNameToDo("");
      setIdToDo("");
      setIsUpdate(false);
    }
    setShow(true);
  };

  const handleCloseNotif2 = () => setShow2(false);
  const handleShowNotif2 = (e) => {
    setIdToDo(e.target.getAttribute("id"));
    setNameToDo(e.target.getAttribute("title"));
    setShow2(true);
  };

  const handleCloseFinish = () => setShowFinish(false);

  const updateActiveTodo = (e) => {
    Axios({
      method: "PATCH",
      data: {
        is_active: e.target.checked === true ? "0" : "1",
      },
      url: `https://todo.api.devcode.gethired.id/todo-items/${e.target.getAttribute("idtodo")}`,
    }).then((res) => {
      console.log(res);
    });
    let dataTodoArray = todoArray.map((el) => {
      if (el.id === parseInt(e.target.getAttribute("idtodo"))) {
        if (e.target.checked === true) {
          el.is_active = 0;
          return el;
        } else {
          el.is_active = 1;
          return el;
        }
      } else {
        return el;
      }
    });
    settodoArray(dataTodoArray);
  };

  const checkTodoArray = () => {
    if (isLoadingToDo === false) {
      if (todoArray.length > 0) {
        // let data = todoArrayFilter.length < 1 ? [...todoArray] : [...todoArrayFilter];
        let result = todoArray.map((el, i) => {
          return (
            <div className="todo-activity" data-cy="todo-item" key={`todo-item-${i}`}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="todo-detail d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input fs-4 me-4 m-0 shadow-none"
                    idtodo={el.id}
                    defaultValue={nameToDo}
                    onChange={updateActiveTodo}
                    checked={parseInt(el.is_active) === 1 ? false : true}
                    data-cy="todo-item-checkbox"
                  />
                  {divCircleColorOption(el.priority, "d-none", false)}
                  <p className={`p-0 m-0 me-3 ${parseInt(el.is_active) === 1 ? "" : "text-decoration-line-through"}`} data-cy="todo-item-title">
                    {el.title}
                  </p>
                  <button id={el.id} priority={el.priority} title={el.title} className="btn p-0 border-0 update-todo" onClick={handleShowNotif} data-cy="todo-item-edit-button">
                    <img src={PencilIcon} alt="" />
                  </button>
                </div>
                <button title={el.title} id={el.id} className="btn p-0 border-0" onClick={handleShowNotif2} data-cy="todo-item-delete-button">
                  <img src={TrashIcon} alt="" />
                </button>
              </div>
            </div>
          );
        });
        return result;
      } else {
        return (
          <div className="text-center" data-cy="todo-empty-state">
            <img src={ImgDetail} alt="Hero Image" className="img-fluid mt-5" />
          </div>
        );
      }
    } else {
      return (
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }
  };

  const updateNameActivity = () => {
    Axios({
      method: "PATCH",
      data: {
        title: valueName,
      },
      url: `https://todo.api.devcode.gethired.id/activity-groups/${param.id}`,
    }).then((res) => {
      console.log(res);
    });
  };

  const deleteToDo = () => {
    setIsSpinerDelete(true);
    Axios({
      method: "DELETE",
      url: `https://todo.api.devcode.gethired.id/todo-items/${idToDo}`,
    }).then((res) => {
      if (res.data.status === "Success") {
        let data = todoArray.filter((el) => el.id !== parseInt(idToDo));
        settodoArray(data);
        setIsSpinerDelete(false);
        setShow2(false);
        setShowFinish(true);
      }
    });
  };

  const handleShowFilter = () => {
    if (showFilter === "d-none") {
      setShowFilter("");
    } else {
      setShowFilter("d-none");
    }
  };
  const setActiveButton = () => {
    const buttons = document.querySelectorAll(".filter-container button");
    buttons.forEach((el) => {
      el.classList.remove("active");
    });
  };

  const sortByTerbaru = (e) => {
    setActiveButton();
    e.target.classList.add("active");
    let data1 = [...todoArray];
    data1.sort(function (a, b) {
      if (new Date(a.updated_at) > new Date(b.updated_at)) {
        return -1;
      } else if (new Date(a.updated_at) < new Date(b.updated_at)) {
        return 1;
      } else {
        return 0;
      }
    });
    settodoArray(data1);
  };
  const sortByTerlama = (e) => {
    setActiveButton();
    e.target.classList.add("active");
    let data2 = [...todoArray];
    data2.sort(function (a, b) {
      if (new Date(a.updated_at) > new Date(b.updated_at)) {
        return 1;
      } else if (new Date(a.updated_at) < new Date(b.updated_at)) {
        return -1;
      } else {
        return 0;
      }
    });
    settodoArray(data2);
  };

  const sortByAZ = (e) => {
    setActiveButton();
    e.target.classList.add("active");
    let data3 = [...todoArray];
    data3.sort(function (a, b) {
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      } else {
        return 0;
      }
    });
    settodoArray(data3);
  };
  const sortByZA = (e) => {
    setActiveButton();
    e.target.classList.add("active");
    let data4 = [...todoArray];
    data4.sort(function (a, b) {
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return -1;
      } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    settodoArray(data4);
  };

  const sortByNotYet = (e) => {
    setActiveButton();
    e.target.classList.add("active");
    let dataBelum = todoArray.filter((el) => parseInt(el.is_active) === 1);
    let dataSudah = todoArray.filter((el) => parseInt(el.is_active) === 0);
    settodoArray([...dataBelum, ...dataSudah]);
  };
  return (
    <>
      <Header />
      <div className="activity-detail">
        <div className="container">
          <div className="subjudul d-flex justify-content-between align-items-center mb-5">
            <div className="judul-activity d-flex align-items-center">
              <Button type="link" href="/" className="btn p-0 me-3 border-0" data-cy="todo-back-button">
                <img src={BackIcon} alt="" />
              </Button>
              <div className="form-update">
                {isLoadingActivity === true ? (
                  <span className="lds-dual-ring cyan"></span>
                ) : (
                  <>
                    <p className={`p-0 m-0 ${isActive === "form" ? "d-none" : ""}`} data-cy="todo-title">
                      {valueName}
                    </p>
                    <input className={`${isActive === "form" ? "" : "d-none"} name-activity`} type="text" defaultValue={valueName} onChange={(e) => setValueName(e.target.value)} onBlur={hiddenForm} />
                  </>
                )}
              </div>

              <Button className="btn p-0 ms-2 border-0 pencil-update" onClick={updateNewJudul} data-cy="todo-title-edit-button">
                <img src={PencilIcon} alt="" />
              </Button>
            </div>
            <div className="position-relative">
              <Button className="btn p-0 me-3 border-0" onClick={handleShowFilter} data-cy="todo-sort-button">
                <img src={UrutkanIcon} alt="" />
              </Button>
              <div className={`filter-container d-flex flex-column align-items-start ${showFilter}`}>
                <button className="btn p-0 me-3 border-0 active" onClick={sortByTerbaru} data-cy="sort-selection">
                  <img src="/icon/terbaru.png" alt="" />
                  <span>Terbaru</span>
                </button>
                <button className="btn p-0 me-3 border-0 " onClick={sortByTerlama} data-cy="sort-selection">
                  <img src="/icon/terlama.png" alt="" />
                  <span>Terlama</span>
                </button>
                <button className="btn p-0 me-3 border-0 " onClick={sortByAZ} data-cy="sort-selection">
                  <img src="/icon/a-z.png" alt="" />
                  <span>A-Z</span>
                </button>
                <button className="btn p-0 me-3 border-0 " onClick={sortByZA} data-cy="sort-selection">
                  <img src="/icon/z-a.png" alt="" />
                  <span>Z-A</span>
                </button>
                <button className="btn p-0 me-3 border-0 " onClick={sortByNotYet} data-cy="sort-selection">
                  <img src="/icon/notyet.png" alt="" />
                  <span>Belum Selesai</span>
                </button>
              </div>
              <button className="rounded-pill btn-cyan" onClick={handleShowNotif} data-cy="todo-add-button">
                + Tambah
              </button>
            </div>
          </div>
          {checkTodoArray()}
          <ModalElement show={show} data-cy="modal-add" size="lg" funcModal={handleCloseNotif} heading="Ubah List Item" isHeader isFooter isSpinner={isSpinner} funcSave={createToDo}>
            <label htmlFor="add-todo" className="fw-bold mb-2">
              NAMA LIST ITEM
            </label>
            <input type="text" id="add-todo" className="form-control py-3 px-4 mb-4 shadow-none" placeholder="Tambahkan nama list item" defaultValue={nameToDo} onChange={(e) => setNameToDo(e.target.value)} />
            <label className="fw-bold mb-2">PRIORITY</label>
            <Select
              options={options}
              defaultValue={selectedOption.value}
              onChange={setSelectedOption}
              className="container-select mb-3"
              classNamePrefix="react-select__control "
              placeholder={divCircleColorOption(selectedOption.value, "", true)}
            />
          </ModalElement>
          <ModalElement show={show2} size="md" data-cy="modal-delete">
            <div className="text-center p-4">
              <img src={WarningIcon} alt="" className="mb-5" data-cy="modal-delete-icon" />
              <p className="fs-5 mb-5" data-cy="modal-delete-title">
                Apakah kamu yakin akan menghapus List Item <strong>"{nameToDo}"</strong>?
              </p>
              <div className="d-flex justify-content-center">
                <Button isPrimary isGray className="rounded-pill me-3" onClick={handleCloseNotif2} data-cy="modal-delete-cancel-button">
                  Batal
                </Button>
                <Button isPrimary isRed className="rounded-pill" onClick={deleteToDo} data-cy="modal-delete-confirm-button">
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
      </div>
    </>
  );
}
