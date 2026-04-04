import { useState } from "react";
import Button from "../Button/Button";

export default function ShortenText({ onCancel, onConfirm, message, initialShortText }) {
    const [shortText, setShortText] = useState(typeof initialShortText === "string" ? initialShortText : "");

    const safeText = typeof shortText === "string" ? shortText : "";

    return (
        <div>
            <h3>Shorten Message</h3>

            <div style={{
                background: "#f1f3f4",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "13px",
                color: "#5f6368",
                marginBottom: "10px"
            }}>
                {message}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={onCancel}>Cancel</button>

                <Button
                    type='button'
                    disabled={!safeText?.trim()}
                    onClick={() => onConfirm(safeText)}
                >
                    Apply
                </Button>
            </div>
        </div>
    );
}