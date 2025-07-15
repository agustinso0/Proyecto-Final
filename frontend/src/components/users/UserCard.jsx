const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card-content">
      <div className="user-info">
        <h4>{user.fullName}</h4>
        <p className="user-email">{user.email}</p>
        <p className="user-balance">
          Balance:{" "}
          <span className="balance-amount">
            ${user.balance?.toFixed(2) || "0.00"}
          </span>
        </p>
      </div>

      <div className="user-actions">
        <button className="btn btn-sm btn-secondary" onClick={onEdit}>
          Editar
        </button>
        <button className="btn btn-sm btn-danger" onClick={onDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default UserCard;
