import Button from "../Button/Button";

export default function LogoutModal({ onCancel, onConfirm }) {

    return (
        <div>
            <h3>Confirm Logout</h3>

            <p style={{
                marginTop: "10px",
                lineHeight: "1.5",
                textAlign: "start",
                fontSize: "14px",
                color: "inherit"
            }}>
                <strong>Are you sure you want to logout?</strong>
                <br></br>
                When you log out, your current session ends, and you'll be temporarily disconnected from the ChatWeb Application. Don't worry, your profile, posts, and messages will be safe until you log back in.
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={onCancel}>Cancel</button>
                <Button onClick={onConfirm}>Confirm</Button>
            </div>
        </div>
    )
}