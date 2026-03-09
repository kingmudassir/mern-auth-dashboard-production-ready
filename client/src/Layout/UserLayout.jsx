import { Outlet } from "react-router-dom"
import Footer from "../Components/Common/Footer"
import Header from "../Components/Common/Header"

function UserLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default UserLayout