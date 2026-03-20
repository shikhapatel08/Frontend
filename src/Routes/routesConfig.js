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
import RouteGuard from "./RouteGuard";

export const appRoutes = [
    { path: "/", element: Signin, isPrivate: false },
    { path: "/Signup", element: Signup, isPrivate: false },
    { path: "/OtpPage", element: OtpPage, isPrivate: false },
    { path: "/ResetPassword", element: ResetPassword, isPrivate: false },
    { path: "/MessagePage", element: MessagePage, isPrivate: true },
    { path: "/Search", element: SearchPage, isPrivate: true },
    { path: "/Settings", element: Settings, isPrivate: true },
    { path: "/EditeProfile", element: EditeProfile, isPrivate: true },
    { path: "/Blocked", element: Blocked, isPrivate: true },
    { path: "/transaction", element: Transaction, isPrivate: true },
    { path: "/notification", element: Notification, isPrivate: true },
    { path: "/StarredMsg", element: StarredMsg, isPrivate: true },
    { path: "/Media", element: Media, isPrivate: true },
    { path: "/ProfilePage/:id", element: ProfilePage, isPrivate: true },
    { path: "/subscriptions", element: SubscriptionPlans, isPrivate: true },
    { path: "/success", element: Success, isPrivate: true },
    { path: "/cancel", element: Cancel, isPrivate: true },
    // { path: "*", element: NotFoundComponent, isPrivate: false }
];