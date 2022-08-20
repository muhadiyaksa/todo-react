import React from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import "./index.scss";

export default function Button(props) {
  const className = [props.className];

  if (props.isRed) className.push("btn-danger");
  if (props.isGray) className.push("btn-secondary");
  if (props.isPrimary) className.push("btn-primary-saika");

  const onClick = () => {
    if (props.onClick) props.onClick();
  };

  if (props.isDisabled || props.isLoading) {
    if (props.isDisabled) className.push("disabled");
    return (
      <span className={className.join(" ")} style={props.style}>
        {props.isLoading ? (
          // Dibawah ini adalah react.fragment
          <>
            <span className="spinner-border spinner-border-sm mx-5"></span>
            <span className="sr-only">Loading ...</span>
          </>
        ) : (
          props.children
        )}
      </span>
    );
  }

  if (props.type === "link") {
    if (props.isExternal) {
      return (
        <a href={props.href} className={className.join(" ")} style={props.style}>
          {props.children}
        </a>
      );
    } else {
      return (
        <Link to={props.href} className={className.join(" ")} style={props.style} onClick={onClick}>
          {props.children}
        </Link>
      );
    }
  }

  return (
    <button className={className.join(" ")} style={props.style} onClick={onClick} id={props.id}>
      {props.children}
    </button>
  );
}

Button.propTypes = {
  type: propTypes.oneOf(["button", "link", "submit"]),
  onClick: propTypes.func,
  href: propTypes.string,
  target: propTypes.string,
  className: propTypes.string,
  isDisabled: propTypes.bool,
  isLoading: propTypes.bool,
  isExternal: propTypes.bool,
  isPrimary: propTypes.bool,
  isRed: propTypes.bool,
  isGray: propTypes.bool,
  id: propTypes.string,
};
