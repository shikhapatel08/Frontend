import { useState } from "react";
import Button from "../Button/Button";

export default function EditMsgModal({ onCancel, onConfirm, message }) {
    const [text, setText] = useState(message.text)

    return (
        <div>
            <h3>Edit Message</h3>

            <div className="Search">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="Serach-input"
                />
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={onCancel}>Cancel</button>
                <Button type='button' disabled={!text?.trim() || text.trim() === message.text.trim()} onClick={() => onConfirm(text)} >Edit</Button>
            </div>
        </div>
    )
}