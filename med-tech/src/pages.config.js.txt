import BloodBank from './pages/BloodBank';
import Dashboard from './pages/Dashboard';
import Emergency from './pages/Emergency';
import EmergencyMode from './pages/EmergencyMode';
import GeneralCare from './pages/GeneralCare';
import HealthCheckups from './pages/HealthCheckups';
import HealthRecords from './pages/HealthRecords';
import Landing from './pages/Landing';
import LanguageSelect from './pages/LanguageSelect';
import LanguageSelection from './pages/LanguageSelection';
import MedicationReminders from './pages/MedicationReminders';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import Reminders from './pages/Reminders';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "BloodBank": BloodBank,
    "Dashboard": Dashboard,
    "Emergency": Emergency,
    "EmergencyMode": EmergencyMode,
    "GeneralCare": GeneralCare,
    "HealthCheckups": HealthCheckups,
    "HealthRecords": HealthRecords,
    "Landing": Landing,
    "LanguageSelect": LanguageSelect,
    "LanguageSelection": LanguageSelection,
    "MedicationReminders": MedicationReminders,
    "Onboarding": Onboarding,
    "Profile": Profile,
    "Reminders": Reminders,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};