import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext.jsx'
 
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import GoogleAnalytics from './components/analytics/GoogleAnalytics.jsx'
import Home from './pages/Home.jsx'
import DiscoverVendors from './pages/DiscoverVendors.jsx'
import DiscoverNew from './pages/DiscoverNew.jsx'
import Dashboard from './pages/Dashboard.jsx'
import RequestsDashboard from './pages/RequestsDashboard.jsx'
import SavedVendors from './pages/SavedVendors.jsx'
import SavedVendorsNew from './pages/SavedVendorsNew.jsx'
import SavedFirms from './pages/SavedFirms.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import HireDevTeam from './pages/HireDevTeam.jsx'
import RequestInformation from './pages/RequestInformation.jsx'
import SubmitSolution from './pages/SubmitSolution.jsx'
import FindTalent from './pages/FindTalent.jsx'
import RequestTalent from './pages/RequestTalent.jsx'
import About from './pages/About.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AdminTools from './pages/AdminTools.jsx'
import PropTech from './pages/PropTech.jsx'
import FinTech from './pages/FinTech.jsx'
import ConTech from './pages/ConTech.jsx'
import MedTech from './pages/MedTech.jsx'
import HealthTech from './pages/HealthTech.jsx'
import SupplyChain from './pages/SupplyChain.jsx'
import AI from './pages/AI.jsx'
import ML from './pages/ML.jsx'
import IoT from './pages/IoT.jsx'
import Web3 from './pages/Web3.jsx'
import ARVR from './pages/ARVR.jsx'
import DigitalTwin from './pages/DigitalTwin.jsx'
import Semiconductors from './pages/Semiconductors.jsx'
import Robotics from './pages/Robotics.jsx'
import ThreeDPrinting from './pages/ThreeDPrinting.jsx'
import EdgeComputing from './pages/EdgeComputing.jsx'
import QuantumComputing from './pages/QuantumComputing.jsx'
import AutomationRobotics from './pages/AutomationRobotics.jsx'
import PowerInfrastructure from './pages/PowerInfrastructure.jsx'
import CompareVendors from './pages/CompareVendors.jsx'
import Certifications from './pages/Certifications.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import Cookies from './pages/Cookies.jsx'
import Sponsorship from './pages/Sponsorship.jsx'
import InstitutionalCapital from './pages/InstitutionalCapital.jsx'
import AINetworking from './pages/AINetworking.jsx'
import FintechAIEra from './pages/FintechAIEra.jsx'
import ConTechAdoption from './pages/ConTechAdoption.jsx'
import HealthcareApproval from './pages/HealthcareApproval.jsx'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  
  useEffect(() => {
    if (currentUser && location.pathname === '/') {
      navigate('/discover', { replace: true })
    }
  }, [currentUser, location.pathname, navigate])
  
  const fullScreen = false
  const isDiscoverPage = location.pathname === '/discover'
  
  return (
    <div className="min-h-screen bg-white">
      <GoogleAnalytics />
      {!fullScreen && <Navbar />}
      <main className={fullScreen ? '' : 'pt-20'}>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/sponsorship" element={<Sponsorship />} />
          <Route path="/resources/institutional-capital" element={<InstitutionalCapital />} />
          <Route path="/resources/ai-networking" element={<AINetworking />} />
          <Route path="/resources/fintech-ai-era" element={<FintechAIEra />} />
          <Route path="/resources/contech-adoption" element={<ConTechAdoption />} />
          <Route path="/resources/healthcare-approval" element={<HealthcareApproval />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected: Main Discover & Dashboard */}
          <Route path="/discover" element={<DiscoverVendors />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><RequestsDashboard /></ProtectedRoute>} />
          
          {/* Protected: Industry Solutions */}
          <Route path="/discover/fintech" element={<FinTech />} />
          <Route path="/discover/proptech" element={<PropTech />} />
          <Route path="/discover/contech" element={<ConTech />} />
          <Route path="/discover/medtech" element={<MedTech />} />
          <Route path="/discover/healthtech" element={<HealthTech />} />
          <Route path="/discover/supplychain" element={<SupplyChain />} />
          <Route path="/discover/supply-chain" element={<SupplyChain />} />
          
          {/* Protected: Software & AI */}
          <Route path="/discover/ai" element={<ProtectedRoute><AI /></ProtectedRoute>} />
          <Route path="/discover/ml" element={<ProtectedRoute><ML /></ProtectedRoute>} />
          <Route path="/discover/iot" element={<ProtectedRoute><IoT /></ProtectedRoute>} />
          <Route path="/discover/web3" element={<ProtectedRoute><Web3 /></ProtectedRoute>} />
          <Route path="/discover/arvr" element={<ProtectedRoute><ARVR /></ProtectedRoute>} />
          <Route path="/discover/digital-twin" element={<ProtectedRoute><DigitalTwin /></ProtectedRoute>} />
          <Route path="/discover/edge-computing" element={<ProtectedRoute><EdgeComputing /></ProtectedRoute>} />
          
          {/* Protected: Hardware & Infrastructure */}
          <Route path="/discover/semiconductors" element={<ProtectedRoute><Semiconductors /></ProtectedRoute>} />
          <Route path="/discover/robotics" element={<ProtectedRoute><Robotics /></ProtectedRoute>} />
          <Route path="/discover/networking" element={<ProtectedRoute><Robotics /></ProtectedRoute>} />
          <Route path="/discover/automation-robotics" element={<ProtectedRoute><AutomationRobotics /></ProtectedRoute>} />
          <Route path="/discover/power-infrastructure" element={<ProtectedRoute><PowerInfrastructure /></ProtectedRoute>} />
          <Route path="/discover/3d-printing" element={<ProtectedRoute><ThreeDPrinting /></ProtectedRoute>} />
          <Route path="/discover/quantum" element={<QuantumComputing />} />
          <Route path="/discover/certifications" element={<ProtectedRoute><Certifications /></ProtectedRoute>} />
          
          {/* Protected: Services & Solutions */}
          <Route path="/hire" element={<ProtectedRoute><HireDevTeam /></ProtectedRoute>} />
          <Route path="/hire/request-information" element={<ProtectedRoute><RequestInformation /></ProtectedRoute>} />
          <Route path="/find-talent" element={<ProtectedRoute><FindTalent /></ProtectedRoute>} />
          <Route path="/find-talent/request" element={<ProtectedRoute><RequestTalent /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><CompareVendors /></ProtectedRoute>} />
          
          {/* Protected: My Workspace */}
          <Route path="/saved" element={<ProtectedRoute><SavedVendors /></ProtectedRoute>} />
          <Route path="/saved-new" element={<ProtectedRoute><SavedVendorsNew /></ProtectedRoute>} />
          <Route path="/saved-firms" element={<ProtectedRoute><SavedFirms /></ProtectedRoute>} />
          
          {/* Public: Submit Solution */}
          <Route path="/submit-solution" element={<SubmitSolution />} />
          
          {/* Protected: Admin */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin-tools" element={<ProtectedRoute><AdminTools /></ProtectedRoute>} />
        </Routes>
      </main>
      {!fullScreen && !isDiscoverPage && <Footer />}
    </div>
  )
}

export default App
