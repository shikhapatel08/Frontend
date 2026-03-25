import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API = import.meta.env.VITE_API_URL;

// ================================= Send Message ================================= //

export const SendMessage = createAsyncThunk(
    'message/SendMessage',
    async ({ chatId, messageText, file, replyTo, tempId }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("chatId", chatId);
            formData.append("text", messageText);
            if (replyTo !== null && replyTo !== undefined) {
                formData.append("replyTo", replyTo)
            }

            if (file && file.length > 0) {
                file.forEach((f) => {
                    formData.append("images", f);
                });
            }

            const res = await axios.post(
                `${BASE_API}/api/v1/message/send`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // "Content-Type": "multipart/form-data",
                    },
                }
            );

            return { message: res.data.msg, tempId: tempId };
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('Daily message limit reached.')
            } else if (error.response?.status === 400) {
                toast.error('You are block in this chat');
            } else if (error.response?.status === 401) {
                toast.error("File sharing is available only for Premium user only.")
            } else if (error.response?.status === 500) {
                toast.error("File size too large pelese upload file less then 5MB.")
            } else {
                toast.error(error.message || "Failed to send message.");
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// ================================= Fetch Messages ================================= //

export const FetchMessages = createAsyncThunk(
    'message/FetchMessages',
    async ({ chatId, page, limit = 20 }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_API}/api/v1/message/${chatId}?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// ================================= Star Message ================================= //

export const StarMsg = createAsyncThunk(
    "message/starMsg",
    async (msgId, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");

            await axios.patch(
                `${BASE_API}/api/v2/messagesetting/star/${msgId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            return msgId;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);


// ================================= Pin Message ================================= //

export const PinMsg = createAsyncThunk(
    'message/PinMsg',
    async ({ msgId, chatId }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${BASE_API}/api/v1/message/pin/${msgId}`,
                {
                    chatId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// ================================= Message Slice ================================= //

const MessageSlice = createSlice({
    name: 'message',
    initialState: {
        error: null,
        loading: false,
        messages: [],
        page: 1,
        hasMore: true,
        canSendMessage: true,
    },
    reducers: {
        addLocalMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
        Starmsg: (state, action) => {
            const msg = state.messages.find(m => m.id === action.payload);
            if (msg) {
                msg.is_star = !msg.is_star;
            }
        },
        Pinmsg: (state, action) => {
            const msgId = action.payload;
            const msg = state.messages.find(m => Number(m.id) === Number(msgId));
            if (msg) {
                msg.is_pin = !msg.is_pin;

            }
        },
        deleteForEveryoneLocal: (state, action) => {
            const msg = state.messages.find(m => m.id === action.payload);

            if (msg) {
                msg.text = "This message was deleted";
                msg.image_url = null;
                msg.is_deleted = true;
            }
        },
        deleteForMeLocal: (state, action) => {
            state.messages = state.messages.filter(
                m => m.id !== action.payload
            );
        },
        resetMessages: (state) => {
            state.messages = [];
            state.page = 1;
            state.hasMore = true;
        },
        updateMessageInstant: (state, action) => {
            const { msgId, text } = action.payload;
            const msg = state.messages.find(m => m.id === msgId);
            if (msg) {
                msg.text = text;
            }
        },
        cansendMessage: (state, action) => {
            state.canSendMessage = action.payload;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(SendMessage.pending, (state) => {
                state.loading = true;
            })

            .addCase(SendMessage.fulfilled, (state, action) => {
                if (action.payload?.status === 403) {
                    state.canSendMessage = false;
                }
                state.loading = false;

                const { tempId, message } = action.payload;

                const index = state.messages.findIndex(msg => msg.id === tempId);

                const normalizedMessage = {
                    ...message,
                    chatId: message.chatId || message.chat_id,
                    sender_id: message.sender_id || message.senderId,
                    createdAt:
                        message.createdAt ||
                        message.created_at ||
                        new Date().toISOString(),
                    image_url:
                        typeof message.image_url === "string"
                            ? JSON.parse(message.image_url)
                            : message.image_url,
                    replyTo:
                        message.reply_to
                            ? state.messages.find(m => m.id === message.reply_to) || null
                            : null,
                    pending: false,
                    status: 'send',
                };

                if (index !== -1) {
                    state.messages[index] = normalizedMessage;
                } else {
                    state.messages.push(normalizedMessage);
                }
            })
            .addCase(SendMessage.rejected, (state, action) => {
                const { tempId } = action.meta.arg;

                const msg = state.messages.find(m => m.id === tempId);

                if (msg) {
                    msg.status = "error";
                }

                state.error = action.payload;
            })

            .addCase(FetchMessages.pending, (state) => {
                state.loading = true;
            })

            .addCase(FetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                const rawMessages = action.payload.messages || action.payload;

                const existingIds = new Set(state.messages.map(m => m.id));
                const newMsgsOnly = rawMessages.filter(m => !existingIds.has(m.id));

                const msgMap = {};
                rawMessages.forEach(m => {
                    msgMap[m.id] = m;
                });
                const parsedNewMSg = newMsgsOnly.map(m => {
                    let parsedImages = [];

                    if (m.image_url) {
                        if (Array.isArray(m.image_url)) {
                            parsedImages = m.image_url;
                        } else if (typeof m.image_url === "string") {
                            try {
                                parsedImages = JSON.parse(m.image_url);
                            } catch (error) {
                                parsedImages = [m.image_url];
                                console.log("Error parsing image_url:", error)
                            }
                        }
                    }

                    return {
                        ...m,
                        chatId: m.chatId || m.chat_id,
                        image_url: parsedImages,
                        replyTo: m.reply_to ? msgMap[m.reply_to] : null,
                        is_star: m.setting?.[0]?.is_star || false,
                    };
                });
                state.loading = false;

                state.messages = [...parsedNewMSg, ...state.messages];

                if (rawMessages.length < 20) {
                    state.hasMore = false;
                } else {
                    state.page += 1;
                }

                console.log("Added", parsedNewMSg.length, "new messages. Total:", state.messages.length);

            })

            .addCase(FetchMessages.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(PinMsg.fulfilled, (state, action) => {
                const updatedMsg = action.payload.message || action.payload.msg;
                state.messages = state.messages.map((msg) =>
                    msg.id === updatedMsg.id ? updatedMsg : msg
                );
            })
    },
});


export const { addLocalMessage, Starmsg, Pinmsg, deleteForEveryoneLocal, deleteForMeLocal, resetMessages, updateMessageInstant, cansendMessage } = MessageSlice.actions;
export default MessageSlice.reducer;