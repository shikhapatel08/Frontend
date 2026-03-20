import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Delete } from "./DeleteSlice";
import { BlockedUser } from "./BlockedSlice";
import { PinedUser } from "./Pinslice";
import { MuteUser } from "./MuteSlice";

const BASE_API = import.meta.env.VITE_API_URL;
// ================================= Create or Get Chat ================================= //
export const createOrGetChat = createAsyncThunk(
  "chat/createOrGetChat",
  async ({ receiverId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BASE_API}/api/v1/chat/create`,
        {
          receiverId: receiverId
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

// ================================= Fetch My Chats ================================= //

export const fetchMyChats = createAsyncThunk(
  "chat/fetchMyChats",
  async ({ page, limit = 10 }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_API}/api/v1/chat/my-chats?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ================================= Create Chat Slice ================================= //
const createChatSlice = createSlice({
  name: "createchat",
  initialState: {
    loading: false,
    error: null,
    chats: [],
    selectedChat: /*JSON.parse(localStorage.getItem("selectedChat")) ||*/ null,
    onlineUsers: {},
    page: 1,
    hasMore: true,
  },
  reducers: {
    SelectedChat: (state, action) => {
      const payload = action.payload;
      if (!payload) {
        state.selectedChat = null;
        return;
      }
      let formattedChat;
      // ✅ Case 1 → from SearchPage (API response)
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

      // ✅ Case 2 → from ChatList
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
        if (chat.UserTwo.id === uid) {
          chat.UserTwo.is_online = on === 1;
        }
        return chat;
      });

      // selected chat mate
      if (state.selectedChat?.User?.id === uid) {
        state.selectedChat.User.is_online = on === 1;
      }
    },
    UnreadCount: (state, action) => {
      const { chatId, unread_count } = action.payload;
      state.chats = state.chats.map(chat =>
        Number(chat.id) === Number(chatId)
          ? { ...chat, unread_count: unread_count }
          : chat
      );
    },
    UpdateChat: (state, action) => {
      const msg = action.payload;

      // existingChatIndex !== -1 → chat is present in array
      // existingChatIndex === -1 → chat is not in array

      // First, check if chat already exists
      const existingChatIndex = state.chats.findIndex(c => c.id === msg.chat?.id || msg.chat_id);

      if (existingChatIndex !== -1) {
        // Chat exists → update it
        const chat = state.chats[existingChatIndex];
        chat.updatedAt = msg.chat?.updatedAt || msg.updatedAt || chat.updatedAt;
        chat.last_message = msg.chat?.last_message || msg.text || chat.last_message;
        chat.last_message_time = msg.chat?.last_message_time || chat.last_message_time;

        // Update unread count safely
        if (state.selectedChat?.id !== chat.id) {
          // Chat is not currently open → increment unread
          if (chat.ChatSettings && chat.ChatSettings[0]) {
            chat.ChatSettings[0].unread_count =
              (chat.ChatSettings[0].unread_count || 0) + 1;
          } else {
            chat.ChatSettings = [{ unread_count: 1 }];
          }
        } else {
          // Chat is open → reset unread
          if (chat.ChatSettings && chat.ChatSettings[0]) {
            chat.ChatSettings[0].unread_count = 0;
          } else {
            chat.ChatSettings = [{ unread_count: 0 }];
          }
        }

        // Move updated chat to top
        state.chats = [
          chat,
          ...state.chats.filter(c => c.id !== chat.id),
        ];

      } else if (msg.chat) {
        // New chat → add safely
        const newChat = {
          id: msg.chat.id,
          last_message: msg.chat.last_message || "",
          last_message_time: msg.chat.last_message_time || "",
          updatedAt: msg.chat.updatedAt || new Date().toISOString(),
          ChatSettings: [{ unread_count: msg.unread_count }],
          is_pin: false,
          is_muted: false,
          is_block: false,
          UserOne: msg.chat.UserOne || {},
          UserTwo: msg.chat.UserTwo || {},
        };

        // Add to top without duplicating
        state.chats = [newChat, ...state.chats];
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyChats.fulfilled, (state, action) => {
        state.loading = false;

        const newchat = action.payload.map(chat => {
          const settings = chat.ChatSettings?.[0] || {};

          return {
            ...chat,
            is_pin: settings.is_pin ?? false,
            is_muted: settings.is_mute ?? false,
            is_block: settings.is_block ?? false

          };
        });

        if (state.page === 1) {
          state.chats = newchat;
        } else {
          state.chats = [...state.chats, ...newchat];
        }

        if (newchat.length < 10) {
          state.hasMore = false;
        } else {
          state.page = + 1;
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

export const { SelectedChat, updateOnlineStatus, UnreadCount, UpdateChat } = createChatSlice.actions;
export default createChatSlice.reducer;
