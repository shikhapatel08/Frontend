// import { lazy } from "react";

// const Signin = lazy(() => import("../Pages/SignIn/SignIn"));
// const Signup = lazy(() => import("../Pages/SignUp/SignUp"));
// const ProfilePage = lazy(() => import("../Pages/Profile/ProfilePage"));
// const EditeProfile = lazy(() => import("../Pages/EditeProfile/EditeProfile"));
// const ResetPassword = lazy(() => import("../Pages/ResetPassword/ResetPassword"));
// const Settings = lazy(() => import("../Pages/settings/Settings"));
// const Blocked = lazy(() => import("../Pages/Blocked/BlockedPage"));
// const SearchPage = lazy(() => import("../Pages/Search/Search"));
// const SubscriptionPlans = lazy(() => import("../Pages/subscriptions/subscriptions"));
// const OtpPage = lazy(() => import("../Pages/OtpPage/OtpPage"));
// const StarredMsg = lazy(() => import("../Pages/Starred Msg/StarredMsg"));
// const Media = lazy(() => import("../Pages/Media/Media"));
// const Notification = lazy(() => import("../Pages/Notification/Notification"));
// const MessagePage = lazy(() => import("../Pages/ChatList/MessagePage"));
// const Success = lazy(() => import("../Pages/subscriptions/Success"));
// const Cancel = lazy(() => import("../Pages/subscriptions/Cancel"));
// const Transaction = lazy(() => import("../Pages/Transaction/Transaction"));

// export const appRoutes = [
//     { path: "/", element: Signin, isPrivate: false },
//     { path: "/Signup", element: Signup, isPrivate: false },
//     { path: "/OtpPage", element: OtpPage, isPrivate: false },
//     { path: "/ResetPassword", element: ResetPassword, isPrivate: true },
//     { path: "/MessagePage", element: MessagePage, isPrivate: true },
//     { path: "/Search", element: SearchPage, isPrivate: true },
//     { path: "/Settings", element: Settings, isPrivate: true },
//     { path: "/EditeProfile", element: EditeProfile, isPrivate: true },
//     { path: "/Blocked", element: Blocked, isPrivate: true },
//     { path: "/transaction", element: Transaction, isPrivate: true },
//     { path: "/notification", element: Notification, isPrivate: true },
//     { path: "/StarredMsg", element: StarredMsg, isPrivate: true },
//     { path: "/Media", element: Media, isPrivate: true },
//     { path: "/ProfilePage", element: ProfilePage, isPrivate: true },
//     { path: "/subscriptions", element: SubscriptionPlans, isPrivate: true },
//     { path: "/success", element: Success, isPrivate: true },
//     { path: "/cancel", element: Cancel, isPrivate: true },
// ];


import Signin from "../Pages/SignIn/SignIn";
import Signup from "../Pages/SignUp/SignUp";
import ProfilePage from "../Pages/Profile/ProfilePage";
import EditeProfile from '../Pages/EditeProfile/EditeProfile';
import ResetPassword from "../Pages/ResetPassword/ResetPassword";
import Settings from "../Pages/settings/Settings";
import Blocked from "../Pages/Blocked/BlockedPage";
import SearchPage from "../Pages/Search/Search";
import SubscriptionPlans from "../Pages/subscriptions/subscriptions";
import OtpPage from "../Pages/OtpPage/OtpPage";
import StarredMsg from "../Pages/Starred Msg/StarredMsg";
import Media from "../Pages/Media/Media";
import Notification from "../Pages/Notification/Notification";
import MessagePage from "../Pages/ChatList/MessagePage";
import Success from "../Pages/subscriptions/Success";
import Cancel from "../Pages/subscriptions/Cancel";
import Transaction from "../Pages/Transaction/Transaction";

export const appRoutes = [
    { path: "/", element: Signin, isPrivate: false },
    { path: "/Signup", element: Signup, isPrivate: false },
    { path: "/OtpPage", element: OtpPage, isPrivate: false },
    { path: "/ResetPassword", element: ResetPassword, isPrivate: true },
    { path: "/MessagePage", element: MessagePage, isPrivate: true },
    { path: "/Search", element: SearchPage, isPrivate: true },
    { path: "/Settings", element: Settings, isPrivate: true },
    { path: "/EditeProfile", element: EditeProfile, isPrivate: true },
    { path: "/Blocked", element: Blocked, isPrivate: true },
    { path: "/transaction", element: Transaction, isPrivate: true },
    { path: "/notification", element: Notification, isPrivate: true },
    { path: "/StarredMsg", element: StarredMsg, isPrivate: true },
    { path: "/Media", element: Media, isPrivate: true },
    { path: "/ProfilePage", element: ProfilePage, isPrivate: true },
    { path: "/subscriptions", element: SubscriptionPlans, isPrivate: true },
    { path: "/success", element: Success, isPrivate: true },
    { path: "/cancel", element: Cancel, isPrivate: true },
];