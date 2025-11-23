import { CONTEST_ENDPOINTS } from "@/config/endpoints";
import API from "@/utils/api"

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