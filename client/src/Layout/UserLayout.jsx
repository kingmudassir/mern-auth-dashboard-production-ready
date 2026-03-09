import { Outlet } from "react-router-dom"
import Footer from "../Components/Common/Footer"
import Header from "../Components/Common/Header"

function UserLayout() {
    return (
        <>
            <Header />

            <main>
                <Outlet />
            </main>

            <Footer />
        </>
    )
}

export default UserLayout