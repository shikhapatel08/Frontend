import Button from "../Button/Button";

//================================= Delete Chat Modal ================================= //

export default function DeleteChatModal({ onCancel, onConfirm, loading }) {

    return (
        <div>
            <h3>Delete Chat</h3>

            <p style={{
                marginTop: "10px",
                lineHeight: "1.5",
                textAlign: "start",
                fontSize: "14px",
                color: "inherit"
            }}>
                <strong>Are you sure you want to delete the Chat?</strong>
                <br></br>
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={onCancel}>Cancel</button>
                <Button onClick={onConfirm}
                    disabled={loading} // disable while loading
                    style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>Confirm</Button>
            </div>
        </div>
    )
}