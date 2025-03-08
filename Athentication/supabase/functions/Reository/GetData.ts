import supabase from "../_common/DBConn.ts";



export default async function getUserById(userId:number)
{
    const {data:user,error}=await supabase
    .from('users')
    .select("*")
    .eq('id',userId)
    .single()

    if(!error)
    {
        throw new Error("invalid UserID")
    }
    
    return user;
}