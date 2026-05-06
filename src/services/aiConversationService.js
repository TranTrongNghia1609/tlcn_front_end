import API from "@/utils/api";

export const aiConversationService = {
    getConversationByProblem: async (problemRef) => {
        const response = await API.get(`/ai-conversations/problem/${problemRef}`);
        return response.data;
    },
    getEligibility: async (problemRef) => {
        const response = await API.get(`/ai-conversations/problem/${problemRef}/eligibility`);
        return response.data;
    },
    addUserMessage: async (problemRef, payload) => {
        const response = await API.post(`/ai-conversations/problem/${problemRef}/messages`, payload);
        return response.data;
    },
    markViewed: async (problemRef) => {
        const response = await API.patch(`/ai-conversations/problem/${problemRef}/viewed`);
        return response.data;
    },
    requestHint: async (problemRef, payload) => {
        const response = await API.post(`/ai-conversations/problem/${problemRef}/request-hint`, payload);
        return response.data;
    },
};
