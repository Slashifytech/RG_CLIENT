import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUsers } from "./features/getUserSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ViewPolicy from "./Components/ViewPolicy";
import ErrorPage from "./Components/ErrorPage";
import ProtectedAdmin from "./Components/ProtectedAdmin";
import Policy from "./pages/Policy";
import ActivePolicy from "./pages/ActivePolicy";
import CancelledPolicy from "./pages/CancelledPolicy";
import AdminPolicy from "./pages/AdminPolicy";
import AgentPolicy from "./pages/AgentPolicy";
import Approval from "./pages/Approval";
import AgentForm from "./pages/AgentForm";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import ProtectedAgent from "./Components/ProtectedAgent"  
import InvoiceForm from "./admin/InvoiceForm";
import MbinvoiceApproval from "./admin/MbinvoiceApproval";
import InvoiceList from "./admin/InvoiceList";
import DocumentList from "./admin/DocumentList";
import ApprovalPage from "./agent/ApprovalPage";
import CustomerApproval from "./pages/CustomerApproval";
import InvoiceView from "./pages/InvoiceView";
import AgentList from "./admin/AgentList";
import AddTeam from "./admin/AddTeam";
import TeamList from "./admin/TeamList";
import TeamInvoices from "./admin/TeamInvoices";
import ProtectedAdminTeam from "./Components/ProtectedAdminTeam";

const router = createBrowserRouter([
  {
    path: "/360policy/login",
    element: <Login></Login>,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedAdmin>
        <AdminDashboard></AdminDashboard>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/add-agent",
    element: (
      <ProtectedAdmin>
        <AgentForm></AgentForm>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/update-agent",
    element: (
      <ProtectedAdmin>
        <AgentForm></AgentForm>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/update-policies",
    element: (
      <ProtectedAgent>
        <Policy></Policy>
      </ProtectedAgent>
    ),
  },
  {
    path: "/admin/add-policies",
    element: (
      <ProtectedAdmin>
        <Policy></Policy>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/update-policies",
    element: (
      <ProtectedAdmin>
        <Policy></Policy>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/new-policy",
    element: (
      <ProtectedAgent>
        <Policy></Policy>
      </ProtectedAgent>
    ),
  },
  {
    path: "/admin/approval-lists",
    element: (
      <ProtectedAdminTeam>
        <Approval></Approval>
      </ProtectedAdminTeam>
    ),
  },

  {
    path: "/admin/agent-policies",
    element: (
      <ProtectedAdmin>
        <AgentPolicy></AgentPolicy>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/policies",
    element: (
      <ProtectedAdmin>
        <AdminPolicy></AdminPolicy>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/cancelled-policy",
    element: (
      <ProtectedAdmin>
        <CancelledPolicy></CancelledPolicy>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/active-policy",
    element: (
      <ProtectedAdminTeam>
        <ActivePolicy></ActivePolicy>
      </ProtectedAdminTeam>
    ),
  },
  {
    path: "/policy",
    element: <ViewPolicy></ViewPolicy>,
  },
  {
    path: "/agent-dashboard",
    element: (
      <ProtectedAgent>
        <AgentDashboard/>
      </ProtectedAgent>
    ),
  },
  {
    path: "/agent/approval",
    element: (
      <ProtectedAgent>
        <ApprovalPage/>
      </ProtectedAgent>
    ),
  },
  {
    path: "/customer-consent",
    element: (
        <CustomerApproval/>
    ),
  },
  {
    path: "/invoice-form",
    element: (
      <ProtectedAdmin>
        <InvoiceForm/>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/mb-invoice",
    element: (
      <ProtectedAdminTeam>
        <MbinvoiceApproval/>
      </ProtectedAdminTeam>
    ),
  },
  {
    path: "/admin/invoice-lists",
    element: (
      <ProtectedAdminTeam>
        <InvoiceList/>
      </ProtectedAdminTeam>
    ),
  },
  {
    path: "/admin/documents",
    element: (
      <ProtectedAdmin>
        <DocumentList/>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/invoice",
    element: (
      // <ProtectedAdmin>
        <InvoiceView/>
      // </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/agent-lists",
    element: (
      <ProtectedAdmin>
        <AgentList/>
      </ProtectedAdmin>
    ),
  },
    {
    path: "/admin/new-team",
    element: (
      <ProtectedAdmin>
        <AddTeam/>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/team-lists",
    element: (
      <ProtectedAdmin>
        <TeamList/>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/team-invoices",
    element: (
      <ProtectedAdmin>
        <TeamInvoices/>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/*",
    element: <ErrorPage></ErrorPage>,
  },
]);
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
 
  return (
    <>
    <div className="overflow-hidden">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
      <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
