import axios from 'axios';
import API from '../utils/api';
import { PROBLEM_ENDPOINTS } from '../config/endpoints';
export const problemService = {
  getProblemById: async (id) =>{
    try{
        // console.log('Get problem by Id 🆔');
        // const data = await API.get(PROBLEM_ENDPOINTS.GET_PROLBEM_ID(id));
        // console.log('Problem data: ', data);
        const data = {
          _id: {
            "$oid": "68bf8d2b4759126242242442"
          },
          name: "Palindrome String",
          statement: "## Palindrome String\nCho một xâu ký tự **s**, hãy kiểm tra xem nó có phải là xâu đối xứng (palindrome) hay không.\n\n### Ràng buộc\n- $1 \\leq |s| \\leq 10^5$\n- Xâu chỉ gồm các ký tự chữ cái thường `a-z`.",
          input: "Một dòng chứa xâu `s`.",
          output: "In `YES` nếu `s` là palindrome, ngược lại in `NO`.",
          img: [],
          isPrivate: false,
          isPdf: false,
          time: 2,
          memory: 512,
          examples: [
            "**Input**\n```\nabba\n```\n\n**Output**\n```\nYES\n```",
            "**Input**\n```\nabc\n```\n\n**Output**\n```\nNO\n```"
          ],
          numberOfTestCases: 4,
          createdAt: {
            $date: "2025-09-09T02:12:59.774Z"
          },
          updatedAt: {
            $date: "2025-09-09T02:12:59.774Z"
          },
          tags: [
            "Tham lam",
            "Số học"
          ]
        }
        return {data: data};
    }
    catch(err){
        console.log('Get problem error: ', err);
        throw err;
    }
  }
}