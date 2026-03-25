import Button from "../Button/Button";

// ================================= Blocked && Unblocked Modal ================================= //

export default function BlockedChatModal({ onCancel, onConfirm, isBlocked , loading}) {

    return (
        <div>
            <h3>{isBlocked ? "Unblock User" : "Block User"}</h3>

            <p style={{
                marginTop: "10px",
                lineHeight: "1.5",
                textAlign: "start",
                fontSize: "14px",
                color: "inherit"
            }}>
                <strong> {isBlocked
                    ? "Are you sure you want to Unblock this user?"
                    : "Are you sure you want to Block this user?"}</strong>
                <br></br>
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={onCancel}>Cancel</button>
                <Button onClick={onConfirm} disabled={loading}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>Confirm</Button>
            </div>
        </div>
    )
}