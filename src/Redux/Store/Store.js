import { configureStore } from '@reduxjs/toolkit'
import SignInReducer from '../Features/SignInSlice'
import SignUpReducer from '../Features/SignUpSlice'
import UpdateProfileReducer from '../Features/UpdateProfileSlice'
import ProfileReducer from '../Features/ProfileSlice'
import UploadImgReducer from '../Features/UploadImgSlice'
import DeleteProfileReudcer from '../Features/DeleteProfileSlice'
import ResetPasswordReducer from '../Features/ResetPasswordSlice'
import FetchAllUserReducer from '../Features/AllUserSlice'
import LogoutReducer from '../Features/LogoutSlice'
import CreatechatReducer from '../Features/CreateChat'
import BlockedReducer from '../Features/BlockedSlice'
import PinedReducer from '../Features/Pinslice'
import MuteReducer from '../Features/MuteSlice'
import SearchReducer from '../Features/SearchSlice'
import DeleteReducer from '../Features/DeleteSlice'
import MessageReducer from '../Features/SendMessage'
import OtpReducer from '../Features/OtpSlice'
import ForgotPasswordReducer from '../Features/ForgotPassword'
import DeleteMeReducer from '../Features/DeleteMeSlice'
import DeleteEveryoneReducer from '../Features/DeleteEveryoneSlice'
import SearchMsgReducer from '../Features/SearchMsgSlice'
import SidebarReducer from '../Features/SideBarSlice'
import StarredMsgReducer from '../Features/StarredMsg'
import MediaReducer from '../Features/MediaSlice'
import NotificationReducer from '../Features/NotificationSlice'
import EditMsgReducer from '../Features/EditMsg'
import subscribeToChatReducer from '../Features/subscriptions'
import EmojiReducer from '../Features/EmojiSlice'
import TextFunctionallyReducer from '../Features/TextFunctionally'
import fcmReducer from '../Features/FcmSlice'
import imagePreviewReducer from '../Features/ImagePreviewSlice'
import GifReducer from '../Features/GifSlice'


export const store = configureStore({
  reducer: {
    signin: SignInReducer,
    signup: SignUpReducer,
    updateProfile: UpdateProfileReducer,
    profileuser: ProfileReducer,
    uploading: UploadImgReducer,
    deleteprofile: DeleteProfileReudcer,
    resetpassword: ResetPasswordReducer,
    alluser: FetchAllUserReducer,
    logout: LogoutReducer,
    createchat: CreatechatReducer,
    blocked: BlockedReducer,
    pined: PinedReducer,
    mute: MuteReducer,
    search: SearchReducer,
    delete: DeleteReducer,
    message: MessageReducer,
    otp: OtpReducer,
    forgotPassword: ForgotPasswordReducer,
    deleteMe: DeleteMeReducer,
    deleteEveryone: DeleteEveryoneReducer,
    searchMsg: SearchMsgReducer,
    sidebar: SidebarReducer,
    starredMsg: StarredMsgReducer,
    media: MediaReducer,
    notifications: NotificationReducer,
    EditMsg: EditMsgReducer,
    subscriptions: subscribeToChatReducer,
    Emoji: EmojiReducer,
    textFunctionally: TextFunctionallyReducer,
    fcm: fcmReducer,
    imagePreview: imagePreviewReducer,
    gif: GifReducer,
  },
})
