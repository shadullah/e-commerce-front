"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

// interface User {
//   fullname: string;
//   photo: string;
//   length: number;
// }

const useUsers = (): any => {
  const [users, setUsers] = useState([]);
  const [load, setLoading] = useState(true);

  const getIdLocal = () => {
    if (typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem("id");
  };

  useEffect(() => {
    const getUserInfo = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get(`/api/v1/users/${getIdLocal()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(res?.data?.data);
        setUsers(res?.data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUserInfo();
  }, []);
  return users;
};

export default useUsers;
