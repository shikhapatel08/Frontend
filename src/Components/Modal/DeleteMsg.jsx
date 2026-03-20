import Button from "../Button/Button";

// ================================= Delete Messages Modal ================================= //

export default function DeleteMsg({
  onCancel,
  onConfirmMe,
  onConfirmAll,
  isMyMessage
}) {
  return (
    <div>
      <h3>Delete Message</h3>

      <p
        style={{
          marginTop: "10px",
          lineHeight: "1.5",
          textAlign: "start",
          fontSize: "14px",
        }}
      >
        <strong>Are you sure you want to delete the Message?</strong>
      </p>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button onClick={onCancel}>Cancel</button>

        <Button onClick={onConfirmMe}>Delete for Me</Button>

        {isMyMessage && (
          <Button onClick={onConfirmAll}>Delete for Everyone</Button>
        )}
      </div>
    </div>
  );
}
