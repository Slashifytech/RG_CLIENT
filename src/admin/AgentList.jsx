import React, { useEffect, useState } from "react";
import AdminCards from "../Components/AdminCards";
import { SiMercedes, SiMg } from "react-icons/si";
import {
  deleteAgentData,
  fetchAllMbAgents,
  fetchAllMgAgents,
} from "../features/adminDashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Nav from "./Nav";
import DataNotFound from "./DataNotFound";
import { Link } from "react-router-dom";

const AgentList = () => {
  const dispatch = useDispatch();
  const { mbAgents, mgAgents } = useSelector((state) => state.admin);

  const [toggle, setToggle] = useState(2);
  const path = location.pathname;

  useEffect(() => {
    dispatch(fetchAllMbAgents());
    dispatch(fetchAllMgAgents());
  }, [dispatch]);

  const toggleTab = (index) => {
    setToggle(index);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await dispatch(deleteAgentData(userId)).unwrap();
      toast.success("Agent deleted successfully");
      return response;
    } catch (error) {
      console.log("Error while deleting", error);
      toast.error("Failed to delete agent");
    }
  };

  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <Nav />
        </span>
      </div>
      <div className="flex flex-row items-start justify-between mr-9  mt-9">
        <p className="md:ml-[22%] sm:ml-[36%] ml-6  text-[23px] font-medium">
          Agent Lists -{" "}
        </p>
        <Link to="/admin/add-agent" state={{ addNew: "isNew" }}>
          <p
            className={` rounded-md bg-primary text-white mb-9 font-normal  md:px-6 sm:px-6  w-48 px-6 text-center py-2 cursor-pointer ${
              path === "/admin/active-users" && "active"
            }`}
          >
            + Add New Agents
          </p>
        </Link>
      </div>
      <div className="mx-6 md:mx-0 sm:mx-0 md:ml-[22%] sm:ml-[36%] flex md:gap-20 gap-3 ">
        <div
          className={`rounded-xl flex items-center gap-3 border border-primary text-black mb-9 font-medium md:px-6 sm:px-6 w-48 px-6 text-center py-2 cursor-pointer ${
            toggle === 2
              ? "bg-primary text-white"
              : "bg-secondary text-black shadow"
          }`}
          onClick={() => toggleTab(2)}
        >
          <SiMercedes />
          <span>Mercedes-Benz</span>
        </div>
        <div
          className={`rounded-xl flex items-center gap-3 border border-primary text-black mb-9 font-medium md:px-6 sm:px-6 w-48 px-6 text-center py-2 cursor-pointer ${
            toggle === 1
              ? "bg-primary text-white"
              : "bg-secondary text-black shadow"
          }`}
          onClick={() => toggleTab(1)}
        >
          <SiMg />
          <span>Morris Garage</span>
        </div>
      </div>

      <div className="md:ml-[22%] sm:ml-[33%] ml-6 mb-20">
        <div className={toggle === 1 ? "flex flex-wrap gap-6 pt-2" : "hidden"}>
          {mgAgents?.length > 0 ? (
            mgAgents.map((agent) => (
              <AdminCards
                key={agent._id}
                id={agent._id}
                name={agent.agentName}
                agentId={agent.agentId}
                handleDelete={handleDelete}
                link="/admin/agent-policies"
                editLink="/admin/update-agent"
                text={"View Policy List"}
              />
            ))
          ) : (
            <div className="mt-20 font-medium text-body ml-[12%] mr-[15%] mb-20">
              <DataNotFound
                className="flex justify-center flex-col w-full items-center  ml-28"
                message="No agents found"
              />
            </div>
          )}
        </div>

        <div className={toggle === 2 ? "flex flex-wrap gap-6" : "hidden"}>
          {mbAgents?.length > 0 ? (
            mbAgents.map((agent) => (
              <AdminCards
                key={agent._id}
                id={agent._id}
                name={agent.agentName}
                agentId={agent.agentId}
                handleDelete={handleDelete}
                link="/admin/agent-policies"
                editLink="/admin/update-agent"
                text={"View Policy List"}

              />
            ))
          ) : (
            <div className="mt-20 font-medium text-body ml-[12%] mr-[15%] mb-20">
              <DataNotFound
                className="flex justify-center flex-col w-full items-center  ml-28"
                message="No Agents found"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AgentList;
