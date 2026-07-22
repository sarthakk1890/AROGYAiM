import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { PublicLayout } from './components/layout/PublicLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { FindPhysio as PublicFindPhysio } from './pages/FindPhysio';
import { ExerciseLibrary } from './pages/ExerciseLibrary';
import { Pricing } from './pages/Pricing';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';

// Auth Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PatientRegistration } from './pages/PatientRegistration';
import { PhysioRegistration } from './pages/PhysioRegistration';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { VerifyEmail } from './pages/VerifyEmail';
import { AccountSuccess } from './pages/AccountSuccess';

// Patient Dashboard
import { Dashboard } from './pages/Dashboard';
import { MyPhysio } from './pages/dashboard/MyPhysio';
import { Appointments } from './pages/dashboard/Appointments';
import { Rehabilitation } from './pages/dashboard/Rehabilitation';
import { ExerciseDetails } from './pages/dashboard/ExerciseDetails';
import { Notifications } from './pages/dashboard/Notifications';
import { Profile } from './pages/dashboard/Profile';
import { HelpSupport } from './pages/dashboard/HelpSupport';

// Patient Booking Flow
import { FindPhysio } from './pages/dashboard/book/FindPhysio';
import { PhysioProfile } from './pages/dashboard/book/PhysioProfile';
import { ScheduleSlot } from './pages/dashboard/book/ScheduleSlot';
import { BookingConfirmation } from './pages/dashboard/book/BookingConfirmation';

// Physio Dashboard
import { PhysioDashboard } from './pages/physio-dashboard/PhysioDashboard';
import { AppointmentRequests } from './pages/physio-dashboard/AppointmentRequests';
import { PhysioCalendar } from './pages/physio-dashboard/PhysioCalendar';
import { Availability } from './pages/physio-dashboard/Availability';
import { RehabHub } from './pages/physio-dashboard/rehab/RehabHub';
import { ExerciseLibrary as PhysioExerciseLibrary } from './pages/physio-dashboard/rehab/ExerciseLibrary';
import { PlanBuilder } from './pages/physio-dashboard/rehab/PlanBuilder';
import { PatientsList } from './pages/physio-dashboard/PatientsList';
import { PatientDetail } from './pages/physio-dashboard/PatientDetail';
import { PhysioAppointments } from './pages/physio-dashboard/PhysioAppointments';
import { Messages } from './pages/physio-dashboard/Messages';
import { PhysioProfile as PhysioProfilePage } from './pages/physio-dashboard/PhysioProfile';

// Admin Dashboard
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { AdminAppointments } from './pages/admin/AdminAppointments';
import { AdminExerciseLibrary } from './pages/admin/AdminExerciseLibrary';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/find-physio" element={<PublicFindPhysio />} />
          <Route path="/exercise-library" element={<ExerciseLibrary />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/patient" element={<PatientRegistration />} />
          <Route path="/register/physio" element={<PhysioRegistration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/account-success" element={<AccountSuccess />} />
        </Route>

        {/* Protected Patient Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
          <Route path="/dashboard">
             <Route index element={<Dashboard />} />
             <Route path="physio" element={<MyPhysio />} />
             <Route path="appointments" element={<Appointments />} />
             <Route path="rehabilitation" element={<Rehabilitation />} />
             <Route path="rehabilitation/:id" element={<ExerciseDetails />} />
             <Route path="notifications" element={<Notifications />} />
             <Route path="profile" element={<Profile />} />
             <Route path="support" element={<HelpSupport />} />
             <Route path="book" element={<FindPhysio />} />
             <Route path="book/:id" element={<PhysioProfile />} />
             <Route path="book/:id/schedule" element={<ScheduleSlot />} />
             <Route path="book/confirmation" element={<BookingConfirmation />} />
          </Route>
        </Route>

        {/* Protected Physio Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={['PHYSIOTHERAPIST']} />}>
          <Route path="/physio-dashboard">
             <Route index element={<PhysioDashboard />} />
             <Route path="patients" element={<PatientsList />} />
             <Route path="patients/:id" element={<PatientDetail />} />
             <Route path="appointments" element={<PhysioAppointments />} />
             <Route path="requests" element={<AppointmentRequests />} />
             <Route path="rehab" element={<RehabHub />} />
             <Route path="rehab/library" element={<PhysioExerciseLibrary />} />
             <Route path="rehab/builder" element={<PlanBuilder />} />
             <Route path="calendar" element={<PhysioCalendar />} />
             <Route path="availability" element={<Availability />} />
             <Route path="messages" element={<Messages />} />
             <Route path="profile" element={<PhysioProfilePage />} />
             <Route path="settings" element={<Navigate to="/physio-dashboard/profile" />} />
          </Route>
        </Route>

        {/* Protected Admin Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin">
             <Route index element={<AdminDashboard />} />
             <Route path="users" element={<UserManagement />} />
             <Route path="appointments" element={<AdminAppointments />} />
             <Route path="library" element={<AdminExerciseLibrary />} />
             <Route path="reports" element={<AdminReports />} />
             <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
