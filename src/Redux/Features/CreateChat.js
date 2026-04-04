import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Delete } from "./DeleteSlice";
import { BlockedUser } from "./BlockedSlice";
import { PinedUser } from "./Pinslice";
import { MuteUser } from "./MuteSlice";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

export const createOrGetChat = createAsyncThunk(
  "chat/createOrGetChat",
  async ({ receiverId }, thunkAPI) => {
    try {
      const res = await axiosInstance.post('/api/v1/chat/create', {
        receiverId: receiverId
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchMyChats = createAsyncThunk(
  "chat/fetchMyChats",
  async ({ page, limit = 10 }, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/api/v1/chat/my-chats`, {
        params: { page, limit }
      });

      return res.data.data;
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session Expired! Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("selectedChat");
        window.location.href = "/";
      }

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const createChatSlice = createSlice({
  name: "createchat",
  initialState: {
    loading: false,
    error: null,
    chats: [],
    selectedChat: JSON.parse(localStorage.getItem("selectedChat")) || null,
    onlineUsers: {},
    page: 1,
    hasMore: true,
  },
  reducers: {
    SelectedChat: (state, action) => {
      const payload = action.payload;
      if (!payload) {
        state.selectedChat = null;
        localStorage.removeItem("selectedChat");
        return;
      }
      let formattedChat;
      if (payload?.data && payload?.receiver) {
        formattedChat = {
          id: payload.data.id,
          User: {
            id: payload.receiver.id,
            name: payload.receiver.name,
            photo:
              payload.receiver.photo ||
              payload.receiver.imageUrl ||
              null,
            is_online: payload.on ?? false
          }
        };
      }

      else {

        formattedChat = {
          ...payload,
          is_block: payload.is_block ?? false,
          is_pin: payload.is_pin ?? false,
          is_muted: payload.is_muted ?? false,
          User: {
            ...payload.User,
            is_online: payload.User?.is_online ?? false
          }
        };
      }
      state.selectedChat = formattedChat;
      localStorage.setItem("selectedChat", JSON.stringify(formattedChat));
    },
    updateOnlineStatus: (state, action) => {
      const { uid, on } = action.payload;

      state.chats = state.chats.map(chat => {
        if (chat.UserOne.id === uid) {
          chat.UserOne.is_online = on === 1;
        }
        if (chat.UserTwo?.id === uid) {
          chat.UserTwo.is_online = on === 1;
        }
        return chat;
      });

      if (state.selectedChat?.User?.id === uid) {
        state.selectedChat.User.is_online = on === 1;
      }
    },
    UnreadCount: (state, action) => {
      const { chatId, unread_count } = action.payload;
      state.chats = state.chats.map(chat =>
        Number(chat.id) === Number(chatId)
          ? { ...chat, unread_count }
          : chat
      );
    },
    UpdateChat: (state, action) => {
      const msg = action.payload;
      const chatId = msg.chat?.id || msg.chat_id;

      const existingChatIndex = state.chats.findIndex(c => c.id === chatId);

      if (existingChatIndex !== -1) {
        const oldChat = state.chats[existingChatIndex];

        const updatedChat = {
          ...oldChat,
          updatedAt: msg.chat?.updatedAt || msg.updatedAt || oldChat.updatedAt,
          last_message: msg.chat?.last_message || msg.text || oldChat.last_message,
          last_message_time: msg.chat?.last_message_time || msg.createdAt || oldChat.last_message_time,
          unread_count: state.selectedChat?.id !== chatId
            ? (oldChat.unread_count || 0)
            : 0
        };

        const otherChats = state.chats.filter(c => c.id !== chatId);
        state.chats = [updatedChat, ...otherChats];

      } else if (msg.chat) {
        const newChat = {
          ...msg.chat,
          unread_count: msg.unread_count || 1,
          is_pin: false,
          is_muted: false,
          is_block: false,
          UserOne: msg.chat.UserOne || {},
          UserTwo: msg.chat.UserTwo || {}
        };

        state.chats = [newChat, ...state.chats];
      }
    }, seen: (state, action) => {
      const cid = typeof action.payload === "object"
        ? action.payload?.cid
        : action.payload;

      state.chats = state.chats.map(chat =>
        Number(chat.id) === Number(cid)
          ? {
            ...chat,
            unread_count: 0,
            ChatSettings: chat.ChatSettings?.map(s => ({ ...s, unread_count: 0 })),
          }
          : chat
      );
    },

  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyChats.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const requestedPage = Number(action.meta.arg?.page || 1);
        const limit = Number(action.meta.arg?.limit || 10);
        const newchat = (action.payload || []).map(chat => {
          const settings = chat.ChatSettings?.[0] || {};

          return {
            ...chat,
            is_pin: settings.is_pin ?? false,
            is_muted: settings.is_mute ?? false,
            is_block: settings.is_block ?? false

          };
        });

        if (requestedPage === 1) {
          state.chats = newchat;
          state.hasMore = true;
        } else {
          const existingIds = new Set(state.chats.map(chat => chat.id));
          const deduped = newchat.filter(chat => !existingIds.has(chat.id));
          state.chats = [...state.chats, ...deduped];
        }

        if (newchat.length < limit) {
          state.hasMore = false;
          state.page = requestedPage;
        } else {
          state.page = requestedPage + 1;
        }
      })
      .addCase(fetchMyChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrGetChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrGetChat.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOrGetChat.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(Delete.fulfilled, (state, action) => {
        const deletedId = action.meta.arg;

        state.chats = state.chats.filter(c => c.id !== deletedId);

        if (state.selectedChat?.id === deletedId) {
          state.selectedChat = null;
        }
      })
      .addCase(BlockedUser.fulfilled, (state, action) => {
        const chatId = action.meta.arg;

        state.chats = state.chats.map(chat =>
          chat.id === chatId
            ? { ...chat, is_block: !chat.is_block }
            : chat
        );
      })
      .addCase(MuteUser.fulfilled, (state, action) => {
        const chatId = action.meta.arg;

        state.chats = state.chats.map(chat =>
          chat.id === chatId
            ? { ...chat, is_muted: !chat.is_muted }
            : chat
        );
      })
      .addCase(PinedUser.fulfilled, (state, action) => {
        const chatId = action.meta.arg;

        state.chats = state.chats.map(chat =>
          chat.id === chatId
            ? { ...chat, is_pin: !chat.is_pin }
            : chat
        );
      });
  },
});

export const { SelectedChat, updateOnlineStatus, UnreadCount, UpdateChat, seen } = createChatSlice.actions;
export default createChatSlice.reducer;
