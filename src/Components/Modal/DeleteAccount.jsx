import Button from "../Button/Button";

//================================= Delete Chat Modal ================================= //

export default function DeleteAccountModal({ onCancel, onConfirm }) {

    return (
        <div>
            <h3>Delete Account</h3>

            <p style={{
                marginTop: "10px",
                lineHeight: "1.5",
                textAlign: "start",
                fontSize: "14px",
                color: "inherit"
            }}>
                <strong>Are you sure you want to delete the Account?</strong>
                <br></br>
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={onCancel}>Cancel</button>
                <Button onClick={onConfirm}>Confirm</Button>
            </div>
        </div>
    )
}