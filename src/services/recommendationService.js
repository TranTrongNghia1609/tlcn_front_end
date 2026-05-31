import API from "@/utils/api";

export const recommendationService = {
    getRecommendedProblems: async (limit = 5) => {
        const response = await API.get(`/recommendations/problems?limit=${limit}`);
        return response.data;
    },
};
