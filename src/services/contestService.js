import { CONTEST_ENDPOINTS } from "@/config/endpoints";
import API from "@/utils/api"
import { getUpcomingContests } from './homeService';

export const getContests = async (params = null) => {
  try {
    console.log(params);
    const response = await API.get(CONTEST_ENDPOINTS.GET_ALL, {params})
    return response.data;
  }
  catch (error) {
    console.error("Error fetching contests:", error);
    throw error;
  }
}

export const getContestByCode = async (code) => {
  try {
    console.log('Get contest by code:', code);
    const response = await API.get(CONTEST_ENDPOINTS.GET_BY_CODE(code));
    const problems = response.data.data.problems?.map((item) => ({
      _id: item.problemId._id,
      name: item.problemId.name,
      // Add other fields from problemId if needed
      difficulty: item.problemId.difficulty,
      shortId: item.problemId.shortId,
      order: item.order + 1, // Display order starts from 1
      point: item.point,
      noOfSolved: item.noOfSolved || 0,
    }))
    response.data.data.problems = problems || [];
    return response.data;
  } catch (error) {
    console.error('Error fetching contest by code:', error);
    throw error;
  }
}

export const registerToContest = async (id, payload) => {
  try {
    const response = await API.post(CONTEST_ENDPOINTS.REGISTER_CONTEST(id), payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching contest by code:', error);
    throw error;
  }
}
export const registerToClassroomContest = async (contestId,  payload = {}) => {
  try {
    const response = await API.post(CONTEST_ENDPOINTS.REGISTER_CLASSROOM_CONTEST(contestId), payload);
    return response.data;
  } catch (error) {
    console.error('Error registering to classroom contest:', error);
    throw error;
  }
}

export const getContestRanking = async (contestId, params = null) => {
  try {
    const response = await API.get(CONTEST_ENDPOINTS.GET_CONTETS_RANKING(contestId), {params});
    return response.data;
  }
  catch (error) {
    console.error('Error fetching contest ranking:', error);
    throw error;
  }
}