import supabase from "../config/supabase.config.js";

const getAllCustomer = async () => {
    const { data, error } = await supabase.from('customers').select('*')
    if (error) {
        console.log(error)
    }
    return data
}

export default getAllCustomer