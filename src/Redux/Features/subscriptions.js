import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API = import.meta.env.VITE_API_URL;

export const subscribeToChat = createAsyncThunk(
    "subscriptions/subscribeToChat",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE_API}/api/v3/plan/getall`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message,
            });
        }
    }
);

export const subscriptionCheckout = createAsyncThunk(
    "subscriptions/subscriptionCheckout",
    async (planId, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${BASE_API}/api/v3/subscription/checkout`,
                { planId },
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

export const Fetchsubscriptiondata = createAsyncThunk(
    "subscriptions/Fetchsubscriptiondata",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE_API}/api/v3/subscription/get-subscription`,
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

export const SubscriptionUserData = createAsyncThunk(
    "subscriptions/SubscriptionUserData",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE_API}/api/v1/users/get-stripe-id`,
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

export const BillingPortal = createAsyncThunk(
    "subscriptions/BillingPortal",
    async (customerId, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE_API}/api/v3/subscription/billing/${customerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.data) {
                toast.error("Billing data not found.");
                return thunkAPI.rejectWithValue("No billing data");
            }
            return res.data;
        } catch (error) {
            toast.error("You don't have any billing right now.");
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const TransactionHistory = createAsyncThunk(
    "subscriptions/TransactionHistory",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${BASE_API}/api/v3/transactions/getall`,
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

const subscriptionsSlice = createSlice({
    name: "subscriptions",
    initialState: {
        loading: false,
        error: null,
        plans: [],
        Data: [],
        customerId: localStorage.getItem("customerId") || null,
        transactionHistory: [],
        type: localStorage.getItem('subscriptionType') || null,
    },
    reducers: {
        UpdateType: (state, action) => {
            const type = action.payload;
            state.type = type;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(subscribeToChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(subscribeToChat.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.plans = action.payload || [];
            })
            .addCase(subscribeToChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(subscriptionCheckout.pending, (state) => {
                state.loading = true;
            })
            .addCase(subscriptionCheckout.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(subscriptionCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(Fetchsubscriptiondata.pending, (state) => {
                state.loading = true;
            })
            .addCase(Fetchsubscriptiondata.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.Data = action.payload.data;
                const type = action.payload.data.Plan?.type;
                state.type = type;
                if (type) {
                    localStorage.setItem('subscriptionType', type);
                } else {
                    localStorage.removeItem('subscriptionType');
                }

            })
            .addCase(Fetchsubscriptiondata.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(SubscriptionUserData.pending, (state) => {
                state.loading = true;
            })
            .addCase(SubscriptionUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.customerId = action.payload.id;
                localStorage.setItem("customerId", action.payload.id);
            })
            .addCase(SubscriptionUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(BillingPortal.pending, (state) => {
                state.loading = true;
            })
            .addCase(BillingPortal.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(BillingPortal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(TransactionHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(TransactionHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.transactionHistory = action.payload.data || [];
            })
            .addCase(TransactionHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { UpdateType } = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;
