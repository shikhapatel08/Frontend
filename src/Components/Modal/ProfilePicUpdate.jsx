import Button from "../Button/Button";

// ================================= Profile Photo Update  Modal ================================= //

export default function ProfilePicUpdate({
  onCancel,
  onConfirmUpload,
}) {
  return (
    <div>
      <h3>Change Profile Photo</h3>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button onClick={onCancel}>Cancel</button>

        <Button onchange={onConfirmUpload}>Upload Photo</Button>

      </div>
    </div>
  );
}
