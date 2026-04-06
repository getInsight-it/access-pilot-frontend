import "./themed-logo.scss";

function ThemedLogo() {
  return (
    <div className="themed-logo">
      <span className="themed-logo__icon-box">
        <img className="themed-logo__icon" src="/img/ap-icon.svg" alt="AccessPilot" />
      </span>
      <span className="themed-logo__title">AccessPilot</span>
    </div>
  );
}

export default ThemedLogo;
