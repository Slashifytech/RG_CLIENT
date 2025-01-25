import apiurl from "../utils";

export const addNewAMC = async (payload) => {
  try {
    const response = await apiurl.post("/add-new-amc", payload);

    return response.data;
  } catch (error) {
    console.log("Error in Adding Amc:", error);
    throw error;
  }
};

export const updateAMC = async (payload, id) => {
  try {
    const response = await apiurl.patch(`/edit-amc/${id}`, payload);

    return response.data;
  } catch (error) {
    console.log("Error in Adding Amc:", error);
    throw error;
  }
};

export const getAMCbyId = async (id, status) => {
  try {
    const response = await apiurl.get(`/amcById`, {
      params: {
        id: id,
        status: status,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error in Adding Amc:", error);
    throw error;
  }
};

export const getAllAmcList = async (
  page,
  perPage,
  searchTerm,
  userId,
  status
) => {
  try {
    const response = await apiurl.get(`/amc-lists`, {
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
    console.log("Error in Adding Amc:", error);
    throw error;
  }
};

export const updateAMCStatus = async (
  amcId,
  type,
  reason
) => {
  try {
    const response = await apiurl.patch(
      "/update-amc-status",
      {
        id: amcId,
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


export const amcResubmit = async (id) => {
  try {
    const response = await apiurl.patch(`/amc-resubmit`, {
      params: {
        amcId: id,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error in resubmitting Amc:", error);
    throw error;
  }
};

export const amcCancelByAdmin = async (id) => {
  try {
    const response = await apiurl.patch(`/disable-amc`, null, {
      params: {
        amcId: id,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error in cancellation Amc:", error);
    throw error;
  }
};