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
import AdminPolicy from "./pages/AdminPolicy";
import Approval from "./pages/Approval";
import AgentForm from "./pages/AgentForm";
import AdminDashboard from "./pages/AdminDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import ProtectedAgent from "./Components/ProtectedAgent"  
import InvoiceForm from "./admin/InvoiceForm";
import InvoiceList from "./admin/InvoiceList";
import CustomerApproval from "./pages/CustomerApproval";
import InvoiceView from "./pages/InvoiceView";
import AgentList from "./admin/AgentList";
import AddTeam from "./admin/AddTeam";
import TeamList from "./admin/TeamList";
import TeamInvoices from "./admin/TeamInvoices";
import ProtectedAdminTeam from "./Components/ProtectedAdminTeam";
import AMCForm from "./pages/AmcForm";
import BuyBackForm from "./pages/BuyBackForm";
import AdminAmcList from "./pages/AmcList";
import BuyBackLists from "./pages/BuyBackLists";
import AgentDocLists from "./pages/AgentDocLists";
import CancelledApprovals from "./admin/CancelledApprovals";
import CancelledPolicy from "./admin/CancelledPolicy";
import ViewAmc from "./pages/ViewAmc";
import ViewBuyBack from "./pages/ViewBuyBack";
import ChangePassword from "./admin/ChangePassword";
import ChangeEmail from "./admin/ChangeEmail";

const router = createBrowserRouter([
  {
    path: "/raam-group/login",
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
    path: "/admin/add-AMC",
    element: (
      <ProtectedAdmin>
        <AMCForm></AMCForm>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/agent/amc-form",
    element: (
      <ProtectedAgent>
        <AMCForm></AMCForm>
      </ProtectedAgent>
    ),
  },
  {
    path: "/admin/update-AMC",
    element: (
      <ProtectedAdmin>
        <AMCForm></AMCForm>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/agent/edit-AMC",
    element: (
      <ProtectedAgent>
        <AMCForm></AMCForm>
      </ProtectedAgent>
    ),
  },
  {
    path: "/admin/amc-lists",
    element: (
      <ProtectedAdmin>
        <AdminAmcList></AdminAmcList>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/agent/amcs-list",
    element: (
      <ProtectedAgent>
        <AdminAmcList></AdminAmcList>
      </ProtectedAgent>
    ),
  },
  {
    path: "/amc-view",
    element: (
        <ViewAmc></ViewAmc>
    ),
  },
  {
    path: "/buyback-view",
    element: (
        <ViewBuyBack></ViewBuyBack>
    ),
  },
  {
    path: "/admin/add-buyback",
    element: (
      <ProtectedAdmin>
        <BuyBackForm></BuyBackForm>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/agent/buyback-form",
    element: (
      <ProtectedAgent>
        <BuyBackForm></BuyBackForm>
      </ProtectedAgent>
    ),
  },
  {
    path: "/admin/update-buyback",
    element: (
      <ProtectedAdmin>
        <BuyBackForm></BuyBackForm>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/agent/edit-buyback",
    element: (
      <ProtectedAgent>
        <BuyBackForm></BuyBackForm>
      </ProtectedAgent>
    ),
  },
  {
    path: "/admin/buyBack-lists",
    element: (
      <ProtectedAdmin>
        <BuyBackLists></BuyBackLists>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/agent/buyBacks-list",
    element: (
      <ProtectedAgent>
        <BuyBackLists></BuyBackLists>
      </ProtectedAgent>
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
    path: "/new-AMC",
    element: (
      <ProtectedAgent>
        <AMCForm></AMCForm>
      </ProtectedAgent>
    ),
  },
  {
    path: "/new-buyback",
    element: (
      <ProtectedAgent>
        <BuyBackForm></BuyBackForm>
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
        <AgentDocLists></AgentDocLists>
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
    path: "/admin/invoice-form",
    element: (
      <ProtectedAdminTeam>
        <InvoiceForm/>
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
    path: "/admin/cancel-approval-lists",
    element: (
      <ProtectedAdmin>
        <CancelledApprovals/>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/change-email",
    element: (
      <ProtectedAdmin>
        <ChangeEmail/>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/change-password",
    element: (
      <ProtectedAdmin>
        <ChangePassword/>
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
