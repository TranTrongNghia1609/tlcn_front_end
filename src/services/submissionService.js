import { SUBMISSION_ENDPOINTS } from "@/config/endpoints";
import API from "@/utils/api"

export const submitCode = async (problemId, code, language) => {
  try{
    const response = await API.post(`/submissions/${problemId}`, {
      source: code,
      language
    });
    return response.data;
  }
  catch (error){
    console.error("Error submitting code:", error);
    throw error;
  }
}

export const getSubmission  = async (userId, problemId) => {
  try{
    const response = await API.get('/submissions', {
      params: {
        userId,
        problemId
      }
    });
    console.log('Submissions response:', response.data);
    return response.data;
  }
  catch (error){
    console.error("Error getting submissions:", error);
    throw error;
  }
}

export const getSubmissionByUserId = async (userId, problemId = null, page = 1, language = 'all', ) => {
  try{
    console.log('Problem ID in service:', problemId);
    const response = await API.get(SUBMISSION_ENDPOINTS.GET_SUBMISSION_BY_USER_ID(userId), {
      params: {
        problemId: problemId, 
        language: language,
        page: page
      }
    });
    console.log('Submissions by user response:', response.data.data);
    return response.data;
  }
  catch (error){
    console.error("Error getting submissions by user:", error);
    throw error;
  }
}


export const getSubmissionById = async (submissionId) => {
  try{
    const response = await API.get(SUBMISSION_ENDPOINTS.GET_SUBMISSION_BY_ID(submissionId));
    return response.data;
  }
  catch (error){
    console.error("Error getting submission by ID:", error);
    throw error;
  }
}

export const getSubmissionCalendar = async (userId) => {
  try{
    const response = await API.get(SUBMISSION_ENDPOINTS.GET_SUBMISSION_CALENDAR(userId));
    return response.data;
  }
  catch (error){
    console.error("Error getting submission by ID:", error);
    throw error;
  }
}

export const getSubmissionStatusChart = async (userId) => {
  try{
    const response = await API.get(SUBMISSION_ENDPOINTS.GET_SUBMISSION_STATUS_CHART(userId));
    console.log('Data status chart submissions (service):', response.data);
    return response.data;
  }
  catch (error){
    console.error("Error getting submission by ID:", error);
    throw error;
  }
}

export const getSubmissionDifficultyChart = async (userId) => {
  try{
    const response = await API.get(SUBMISSION_ENDPOINTS.GET_SUBMISSION_DIFFICULTY_CHART(userId));
    console.log('Data difficulty chart submissions (service):', response.data);
    return response.data;
  }
  catch (error){
    console.error("Error getting difficulty chart:", error);
    throw error;
  }
}