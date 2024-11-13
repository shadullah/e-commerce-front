"use client";
import useUsers from "@/hooks/useUsers";
import React from "react";
import CountUp from "react-countup";

const Dashboard = () => {
  const [users] = useUsers();
  console.log(users);

  //   const ttlUser = users?.map((user) => user.length);
  return (
    <div>
      <h1 className="text-3xl font-bold">Overview</h1>
      <div className="grid grid-cols-3 gap-6 mt-6 md:h-32">
        <div className="bg-red-400 p-2 md:p-4 rounded-md w-full">
          <h4 className="text-xs md:text-xl mb-3">Total Users</h4>
          <p>
            <span className="text-sm md:text-4xl">
              <CountUp start={0} end={users?.length} duration={5} />{" "}
            </span>{" "}
            Users
          </p>
        </div>
        <div className="bg-indigo-400 p-2 md:p-4 rounded-md cursor-pointer">
          <h4 className="text-xs md:text-xl mb-3">Completed</h4>
          <p>
            <span className="text-sm md:text-4xl">
              {/* <CountUp start={0} end={completedtask} duration={5} />{" "} */}
            </span>{" "}
            Tasks
          </p>
        </div>
        <div className="bg-cyan-400 p-2 md:p-4 rounded-md">
          <h4 className="text-xs md:text-xl md:mb-3">In Progress</h4>
          <p>
            <span className="text-sm md:text-4xl">
              {/* <CountUp start={0} end={inProgress} duration={5} />{" "} */}
            </span>{" "}
            Tasks
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
