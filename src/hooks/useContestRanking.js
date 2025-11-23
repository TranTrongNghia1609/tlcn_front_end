// hooks/useContestRanking.js
import { getContestRanking } from "@/services/contestService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useContestRanking = (contestId) => {
  // State cục bộ để bật/tắt chế độ tự động cập nhật
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const query = useQuery({
    queryKey: ["contest-ranking", contestId], // Key định danh duy nhất cho cache
    queryFn: () => getContestRanking(contestId),
    
    // --- CẤU HÌNH REAL-TIME ---
    // Nếu isAutoRefresh = true -> Cập nhật mỗi 10 giây (10000ms)
    // Nếu false -> Không tự cập nhật
    refetchInterval: isAutoRefresh ? 10000 : false,
    
    // Tự cập nhật ngay khi user quay lại tab (UX cực tốt cho contest)
    refetchOnWindowFocus: true,

    enabled: contestId != null,
    
    // Giữ data cũ hiển thị trong lúc đang fetch data mới (tránh giật màn hình)
    placeholderData: (previousData) => previousData, 
  });

  return {
    ...query,
    isAutoRefresh,
    setIsAutoRefresh, // Trả về hàm này để gắn vào nút Toggle
  };
};