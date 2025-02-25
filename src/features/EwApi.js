import apiurl from "../utils";

export const addNewEw = async (payload) => {
  try {
    const response = await apiurl.post("/add-new-ew", payload);

    return response.data;
  } catch (error) {
    console.log("Error in Adding Buy Back:", error);
    throw error;
  }
};

export const updateEw = async (payload, id) => {
  try {
    const response = await apiurl.patch(`/edit-ew-policy/${id}`, payload);

    return response.data;
  } catch (error) {
    console.log("Error in Adding Buy Back:", error);
    throw error;
  }
};

export const getEwId = async (id, status) => {
  try {
    const response = await apiurl.get(`/ew-policy`, {
      params: {
        id: id,
        status: status,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error in Adding Buy Back:", error);
    throw error;
  }
};

export const getAllEwLists = async (
  page,
  perPage,
  searchTerm,
  userId,
  status
) => {
  try {
    const response = await apiurl.get(`/ew-lists`, {
      params: {
        id: userId,
        status: status,
        search: searchTerm,
        page: page,
        perPage: perPage,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error in Adding Buy Back:", error);
    throw error;
  }
};
export const updateEwStatus = async (ewId, type, reason) => {
  try {
    const response = await apiurl.patch(
      "/update-ew-status",
      {
        id: ewId,
        type: type,
      },
      {
        params: {
          reason: reason,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error submitting policy data:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const ewResubmit = async (id) => {
  try {
    const response = await apiurl.patch(`/ew-resubmit`,null, {
      params: {
        buyBackId: id,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error in resubmitting Buy Back:", error);
    throw error;
  }
};

export const ewCancelByAdmin = async (id) => {
  try {
    const response = await apiurl.patch(`/disable-ew`,null, {
      params: {
        buyBackId: id,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error in cancellation Buy Back:", error);
    throw error;
  }
};
