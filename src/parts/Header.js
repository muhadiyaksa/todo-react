import React from "react";

export default function Header() {
  return (
    <div className="header" data-cy="header-background">
      <div className="container">
        <h3 data-cy="header-title" className="fw-bold text-light">
          TO DO LIST APP
        </h3>
      </div>
    </div>
  );
}
