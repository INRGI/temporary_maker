import axios from "axios";
import { GetBroadcastsListResponse } from "./broadcast/response/get-broadcasts-list.response.dto";
import { MakeBroadcastRequest } from "./broadcast/request/make-broadcast.request.dto";
import { ApproveBroadcastRequest } from "./broadcast/request/approve-broadcast.request.dto";
import { GetAllDomainsResponse } from "./broadcast/response/get-all-domains.response.dto.";
import { ApproveBroadcastSheetResponse } from "./broadcast/response/approve-broadcast-sheet.response.dto";

const broadcastToolApiUrl = "/api/finances/broadcast-tool/broadcast";

export const getBroadcastsList =
  async (): Promise<GetBroadcastsListResponse> => {
    try {
      const response = await axios.get(
        `${broadcastToolApiUrl}/broadcasts-list`
      );
      return response.data;
    } catch (error) {
      return { sheets: [] };
    }
  };

export const makeBroadcast = async (
  body: MakeBroadcastRequest
): Promise<GetAllDomainsResponse> => {
  try {
    const response = await axios.post(
      `${broadcastToolApiUrl}/make-broadcast`,
      body
    );
    return response.data;
  } catch (error) {
    return { sheets: [] };
  }
};

export const approveBroadcast = async (
  body: ApproveBroadcastRequest
): Promise<ApproveBroadcastSheetResponse> => {
  try {
    const response = await axios.post(
      `${broadcastToolApiUrl}/approve-broadcast`,
      body
    );
    return response.data;
  } catch (error) {
    return { response: [] };
  }
};
