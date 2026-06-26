import API from "@/utils/api";

export const submitPreTest = async (payload) => {
  try {
    const response = await API.post('/pretest', payload);
    return response.data;
  } catch (error) {
    console.error("Error submitting pre-test:", error);
    throw error;
  }
};

export const getPreTestResult = async (preTestId) => {
  try {
    const response = await API.get(`/pretest/${preTestId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting pre-test result for ${preTestId}:`, error);
    throw error;
  }
};
