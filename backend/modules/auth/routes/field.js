exports.routeParams = [
    {
      route: "auth/login",
      params: { email: "", password: "" },
      queryParams: [],
      authRequired: true,
      method: "post",
      tag: "Auth",
    },
    {
      route: "auth/signup",
      params: { fullName: "", email: "", password: "", phoneNumber: "", timezone: "" },
      queryParams: [],
      authRequired: true,
      method: "post",
      tag: "Auth",
    },
   
  ];
  