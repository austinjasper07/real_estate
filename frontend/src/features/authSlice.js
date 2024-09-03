import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

const fetchOptions = (formData) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  };
};

export const signup = createAsyncThunk(
  "auth/signup", // Name
  async (formData) => {
    try {
      const response = await fetch(`${API_URL}/sign_up`, fetchOptions(formData));
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.message;
    } catch (error) {
      throw error;
    }
  }
);

export const login = createAsyncThunk("auth/login", async (formData) => {
  try {
    const response = await fetch(`${API_URL}/login`, fetchOptions(formData));
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    console.log('Success:', result);
    return result
  }
  catch (error) {
    throw new Error(error.message);
  }
});
export const OAuth = createAsyncThunk("auth/OAuth", async (formData) => {
  try {
    const response = await fetch(`${API_URL}/OAuth`, fetchOptions(formData));
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    console.log('Success:', result);
    return result
  }
  catch (error) {
    throw new Error(error.message);
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  try {
    // Make a request to clear the token from the server
    const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    
    // Clear the local state
    dispatch(resetAuth());

    return response.data
    
  } catch (error) {
    console.error('Logout failed: ', error);
    throw error;
  }
});

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (formData) => {
    try {
      const response = await fetch(`${API_URL}/verify_email`, fetchOptions(formData));
      
      const responseData = await response.json();

      if(!responseData.success) throw new Error(responseData.message);
      
      return responseData;

    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (formData) => {
    try {
      const response = await fetch(`${API_URL}/forgot_password`, fetchOptions(formData));
      
      const responseData = await response.json();

      if(!responseData.success) throw new Error(responseData.message);
      
      return responseData.message;

    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const resend_verifyCode = createAsyncThunk(
  "auth/resend_verifyCode",
  async (formData) => {
    try {
      const response = await fetch(
        `${API_URL}/resend_verifyCode`,
        fetchOptions(formData)
      );

      const responseData = await response.json();

      if (!responseData.success) throw new Error(responseData.message);

      return responseData.message;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const check_auth = createAsyncThunk("auth/check_auth", async () => {
  try {
    const response = await axios.get(`${API_URL}/check_auth`, {withCredentials: true});
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
  
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    error: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    message: null,
    modal: false,
    isCheckingAuth: true,
  },
  reducers: {
    showModal(state) {
      state.modal = true;
    },
    hideModal(state) {
      state.modal = false;
    },
    reset(state) {
      state.status = "idle";
      state.message = null;
      state.error = null;
    },
    resetAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Adding newUser
      .addCase(signup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message; // Capture the error message
      })

      // for login request
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // for OAuth request
      .addCase(OAuth.pending, (state) => {
        state.status = "loading";
      })
      .addCase(OAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(OAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // for logout
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = null;
        state.isAuthenticated = false;
        state.message = action.payload.message;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // for verifyEmail request
      .addCase(verifyEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // for forgotPassword request
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // for resend_verifyCode request
      .addCase(resend_verifyCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resend_verifyCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(resend_verifyCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // for check_auth request
      .addCase(check_auth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(check_auth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isCheckingAuth = false;
      })
      .addCase(check_auth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isCheckingAuth = false;
      });
  },
});

export const {reset, resetAuth, showModal, hideModal} = authSlice.actions
export default authSlice.reducer;
