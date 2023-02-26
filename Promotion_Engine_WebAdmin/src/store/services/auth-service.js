import request from "../request";

class AuthService {
  async login(user) {
    return request
      .post("api/login", user)
      .then((response) => {
        if (response.status == 200) {
          return response.data;
        }
      })
      .catch((error) => {
        console.log("auth-service.js " + error);
        return error;
      });
  }

  validation(session){
    let isValidation = false;
    if (session.exists()) {
      let token = session.get("user-info");
      isValidation = token != null ? true : false;
    }
    return isValidation
  }
}

export default new AuthService();
