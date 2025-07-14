import React, { useEffect, useState } from "react";
import BroadcastSendsAnalytics from "../BroadcastSendsAnalytics";
import { GetBroadcastsSendsResponseDto } from "../../../api/broadcast";
import Loader from "../../Common/Loader";
import { getBroadcastsSends } from "../../../api/broadcast.api";
import { toastError } from "../../../helpers/toastify";
import { getCachedData, setCachedData } from "../../../helpers/getCachedData";

const CACHE_KEY = "broadcast_sends";
const TTL_MS = 30 * 60 * 1000;

const AdminHome: React.FC = () => {
  const [broadcastsSends, setBroadcastsSends] =
    useState<GetBroadcastsSendsResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    Promise.allSettled([fetchBroadcastsSends()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const fetchBroadcastsSends = async () => {
    const cached = getCachedData<GetBroadcastsSendsResponseDto>(
      CACHE_KEY,
      TTL_MS
    );
    if (cached) {
      setBroadcastsSends(cached);
      return;
    }

    try {
      const response = await getBroadcastsSends();
      if (!response) {
        toastError("Failed to fetch broadcasts sends");
        return;
      }
      setBroadcastsSends(response);
      setCachedData(CACHE_KEY, response, TTL_MS);
    } catch (error) {
      toastError("Failed to fetch broadcasts sends");
      setBroadcastsSends(null);
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : broadcastsSends?.broadcasts?.length ? (
        <BroadcastSendsAnalytics data={broadcastsSends} />
      ) : (
        <p style={{ padding: 20, color: "#888" }}>No broadcasts data found.</p>
      )}
    </div>
  );
};

export default AdminHome;
