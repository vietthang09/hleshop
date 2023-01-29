import Axios from "axios";
import cookie from "react-cookies";
export const getUser = async(token)=>{
    const res = await Axios({
        method: 'post',
        url: 'http://localhost:5000/user/getUser',
        data: {
            token: JSON.parse(token),
          },
    });
    // console.log(res.data)
    if(res.data.message){
        if(res.data.message.message ==="jwt expired"){
            cookie.remove("token");
            return false;
        }
    }else{
        return true  
    }
    
}