import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Doctors from "./pages/Doctors";
import Slots from "./pages/Slots";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import ManageSlots from "./pages/admin/ManageSlots";
import ManageAppointments from "./pages/admin/ManageAppointments";
import ManagePatients from "./pages/admin/ManagePatients";

function App() {
    return (
        <BrowserRouter>
            <Navbar/>

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/doctors" element={<Doctors/>}/>
                    <Route path="/slots" element={<Slots/>}/>

                    <Route
                        path="/slots/:slotId/book"
                        element={
                            <ProtectedRoute>
                                <BookAppointment/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/my-appointments"
                        element={
                            <ProtectedRoute>
                                <MyAppointments/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <AdminDashboard/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/doctors"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <ManageDoctors/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/slots"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <ManageSlots/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/appointments"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <ManageAppointments/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/patients"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <ManagePatients/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;