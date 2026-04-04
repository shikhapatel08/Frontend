import Button from "../Button/Button";

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
                <br></br>
                <b>Warning:</b> Deleting your account immediately ends your subscription and premium access. Please back up your data now, as it will be permanently deleted in 30 days.
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={onCancel}>Cancel</button>
                <Button onClick={onConfirm} >Confirm</Button>
            </div>
        </div>
    )
}