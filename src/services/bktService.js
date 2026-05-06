import API from "@/utils/api";

export const bktService = {
  /**
   * Lấy skill mastery của user hiện tại.
   * @param {string} [sort='desc'] - 'asc' hoặc 'desc'
   */
  getUserSkillMastery: async (sort = "desc") => {
    const response = await API.get(`/bkt/mastery?sort=${sort}`);
    return response.data;
  },

  /**
   * Lấy skill mastery của user khác (public).
   * @param {string} userId
   */
  getUserSkillMasteryById: async (userId) => {
    const response = await API.get(`/bkt/mastery/${userId}`);
    return response.data;
  },

  /**
   * Lấy lịch sử P(L) cho 1 tag.
   * @param {string} tagName
   */
  getSkillHistory: async (tagName) => {
    const response = await API.get(
      `/bkt/mastery/history/${encodeURIComponent(tagName)}`
    );
    return response.data;
  },
};
