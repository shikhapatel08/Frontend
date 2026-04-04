import { Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from '../Components/Common Components/Common/SideBar/SideBar'
import { appRoutes } from "./routesConfig";
import RouteGuard from "./RouteGuard";


export default function AppRoutes() {
    const location = useLocation();
    const hideNavbarOn = ["/", "/Signup", "/signup", '/OtpPage', '/success', '/cancel', '/ResetPassword'];

    return (
        <>
            {!hideNavbarOn.includes(location.pathname) && (
                <>
                    <Sidebar />
                </>
            )}

            <Suspense fallback={<div style={{ padding: "20px" }}>Loading...</div>}>
                <Routes>
                    {appRoutes.map(({ path, element: Component, isPrivate }) => (
                        <Route
                            key={path}
                            path={path}
                            element={
                                <RouteGuard isPrivate={isPrivate}>
                                    <Component />
                                </RouteGuard>
                            }
                        />
                    ))}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>

        </>
    )
}
