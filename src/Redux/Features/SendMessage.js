import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

export const SendMessage = createAsyncThunk(
    'message/SendMessage',
    async ({ formData }, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/api/v1/message/send', formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            return { message: res.data.msg };
        } catch (error) {

            const errMsg =
                error?.response?.data?.message ||
                error?.response?.data?.msg ||
                error?.message ||
                "Something went wrong";

            toast.error(errMsg);
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const forwardMessage = createAsyncThunk(
    "message/forwardMessage",
    async ({ msgId, chatIds }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/api/v1/message/forward", {
                msgId,
                chatIds,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const FetchMessages = createAsyncThunk(
    'message/FetchMessages',
    async ({ chatId, page, limit = 20 }, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/api/v1/message/${chatId}`, {
                params: { page, limit }
            });
            return res.data;
        } catch (error) {
            const errMsg =
                error?.response?.data?.message ||
                error?.response?.data?.msg ||
                error?.message ||
                "Something went wrong";

            toast.error(errMsg);
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const StarMsg = createAsyncThunk(
    "message/starMsg",
    async (msgId, thunkAPI) => {
        try {
            await axiosInstance.patch(`/api/v2/messagesetting/star/${msgId}`, {});
            return msgId;
        } catch (error) {
            const errMsg =
                error?.response?.data?.message ||
                error?.response?.data?.msg ||
                error?.message ||
                "Something went wrong";

            toast.error(errMsg);
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const PinMsg = createAsyncThunk(
    'message/PinMsg',
    async ({ msgId, chatId }, thunkAPI) => {
        try {
            const res = await axiosInstance.patch(`/api/v1/message/pin/${msgId}`, { chatId });
            return res.data;
        } catch (error) {
            const errMsg =
                error?.response?.data?.message ||
                error?.response?.data?.msg ||
                error?.message ||
                "Something went wrong";

            toast.error(errMsg);
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const FetchAllPinnedMsg = createAsyncThunk(
    'message/FetchAllPinnedMsg',
    async ({ chatId, limit = 20 }, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/api/v1/message/get-pin-messages/${chatId}`, {
                params: { limit }
            });
            return res.data;
        } catch (error) {
            const errMsg =
                error?.response?.data?.message ||
                error?.response?.data?.msg ||
                error?.message ||
                "Something went wrong";

            toast.error(errMsg);
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const MessageSlice = createSlice({
    name: 'message',
    initialState: {
        error: null,
        loading: false,
        messages: [],
        page: 1,
        hasMore: true,
        canSendMessage: true,
        pinnedMessages: []
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
                if (msg.is_pin) {
                    const exists = state.pinnedMessages.find(pm => Number(pm.id) === Number(msgId));
                    if (!exists) {
                        state.pinnedMessages.push(msg);
                    }
                } else {
                    state.pinnedMessages = state.pinnedMessages.filter(
                        pm => Number(pm.id) !== Number(msgId)
                    );
                }
            } else {
                state.pinnedMessages = state.pinnedMessages.filter(
                    pm => Number(pm.id) !== Number(msgId)
                );
            }
        },
        deleteForEveryoneLocal: (state, action) => {
            const msg = state.messages.find(m => m.id === action.payload);

            if (msg) {
                msg.text = "This message was deleted";
                msg.image_url = null;
                msg.is_deleted = true;
                msg.delete_for_all = true;
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
            const { msgId, text, is_deleted, delete_for_all, is_edited } = action.payload;

            const msg = state.messages.find(m => m.id === msgId);

            if (msg) {
                if (text !== undefined) msg.text = text;
                if (is_deleted !== undefined) msg.is_deleted = is_deleted;
                if (delete_for_all !== undefined) msg.delete_for_all = delete_for_all;
                if (is_edited !== undefined) msg.is_edited = is_edited;
            }
        },
        cansendMessage: (state, action) => {
            state.canSendMessage = action.payload;
        },
        updateMessageStatus: (state, action) => {
            const { chatId, status } = action.payload;
            state.messages = state.messages.map(m =>
                Number(m.chatId) === Number(chatId)
                    ? { ...m, status }
                    : m
            );
        },
        setReactionLocal: (state, action) => {
            const { msgId, userId, emoji } = action.payload;

            const message = state.messages.find(m => m.id === msgId);
            if (!message) return;

            if (!message.reactions) {
                message.reactions = [];
            }

            const existingIndex = message.reactions.findIndex(
                r => r.user_id === userId
            );

            if (emoji === null) {
                if (existingIndex !== -1) {
                    message.reactions.splice(existingIndex, 1);
                }
                return;
            }

            if (existingIndex !== -1) {
                message.reactions[existingIndex].emoji = emoji;
            }

            else {
                message.reactions.push({
                    user_id: userId,
                    emoji
                });
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(SendMessage.pending, (state) => {
                state.loading = true;
            })

            .addCase(SendMessage.fulfilled, (state, action) => {
                state.loading = false;

                const { message } = action.payload;

                const normalizedMessage = {
                    ...message,
                    chatId: message.chatId || message.chat_id,
                    sender_id: message.sender_id || message.senderId,
                    createdAt:
                        message.createdAt ||
                        message.created_at ||
                        new Date().toISOString(),
                    image_url: (() => {
                        if (Array.isArray(message.image_url)) return message.image_url;
                        if (typeof message.image_url === "string") {
                            try {
                                return JSON.parse(message.image_url);
                            } catch {
                                return [message.image_url];
                            }
                        }
                        return message.image_url;
                    })(),
                    replyTo:
                        message.reply_to
                            ? state.messages.find(m => m.id === message.reply_to) || null
                            : null,
                    pending: false,
                    status: message.status || 'sent',
                };

                if (index !== -1) {
                    state.messages[index] = normalizedMessage;
                } else {
                    state.messages.push(normalizedMessage);
                }
            })
            .addCase(SendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(FetchMessages.pending, (state) => {
                state.loading = true;
            })

            .addCase(FetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const requestPage = Number(action.meta.arg?.page || 1);
                const requestLimit = Number(action.meta.arg?.limit || 20);

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

                if (rawMessages.length < requestLimit) {
                    state.hasMore = false;
                    state.page = requestPage;
                } else {
                    state.hasMore = true;
                    state.page = requestPage + 1;
                }

            })

            .addCase(FetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(PinMsg.fulfilled, (state, action) => {
                const updatedMsg = action.payload.message || action.payload.msg || action.payload;

                if (updatedMsg && updatedMsg.id) {
                    state.messages = state.messages.map((msg) =>
                        Number(msg.id) === Number(updatedMsg.id) ? { ...msg, ...updatedMsg } : msg
                    );

                    if (updatedMsg.is_pin) {
                        const exists = state.pinnedMessages.find(pm => Number(pm.id) === Number(updatedMsg.id));
                        if (!exists) {
                            state.pinnedMessages.push(updatedMsg);
                        } else {
                            state.pinnedMessages = state.pinnedMessages.map(pm =>
                                Number(pm.id) === Number(updatedMsg.id) ? updatedMsg : pm
                            );
                        }
                    } else {
                        state.pinnedMessages = state.pinnedMessages.filter(
                            pm => Number(pm.id) !== Number(updatedMsg.id)
                        );
                    }
                }
            })
            .addCase(PinMsg.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(FetchAllPinnedMsg.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchAllPinnedMsg.fulfilled, (state, action) => {
                state.loading = false;
                state.pinnedMessages = action.payload.data;
            })
            .addCase(FetchAllPinnedMsg.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(forwardMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(forwardMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});


export const { addLocalMessage, Starmsg, Pinmsg, deleteForEveryoneLocal, deleteForMeLocal, resetMessages, updateMessageInstant, cansendMessage, updateMessageStatus, setReactionLocal } = MessageSlice.actions;
export default MessageSlice.reducer;
