
import getUserById from "../Reository/GetData.ts";
export default async function getDataService(id:number)
{
   const data= await getUserById(id);
   return data;
}