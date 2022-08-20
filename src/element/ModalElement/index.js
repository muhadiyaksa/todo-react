import React from "react";
import propTypes from "prop-types";
import { Modal } from "react-bootstrap";
import "./index.scss";
import Button from "../Button";

export default function ModalElement(props) {
  const { show, funcModal, heading, isFooter, isHeader, size } = props;
  return (
    <Modal show={show} onHide={funcModal} size={size} aria-labelledby="contained-modal-title-vcenter" centered>
      {isHeader ? (
        <Modal.Header closeButton>
          <Modal.Title className="fs-6">{heading}</Modal.Title>
        </Modal.Header>
      ) : (
        ""
      )}
      <Modal.Body>{props.children}</Modal.Body>

      {isFooter ? (
        <Modal.Footer>
          <div class="text-end">
            <Button isPrimary className="rounded-pill d-inline-flex align-items-center" onClick={props.funcSave}>
              <span>Simpan</span>
              {props.isSpinner === true ? <span class="lds-dual-ring"></span> : ""}
            </Button>
          </div>
        </Modal.Footer>
      ) : (
        ""
      )}
    </Modal>
  );
}

ModalElement.propTypes = {
  heading: propTypes.string,
  size: propTypes.string,
  funcModal: propTypes.func,
  funcSave: propTypes.func,
  show: propTypes.bool,
  isHeader: propTypes.bool,
  isFooter: propTypes.bool,
  isSpinner: propTypes.bool,
};
