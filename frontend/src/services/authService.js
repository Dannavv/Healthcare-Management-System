import { dummyDoctors } from "../data/dummyDoctors";

export const loginDoctor = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const doctor = dummyDoctors.find(
        (d) => d.email === email && d.password === password
      );

      if (!doctor) {
        reject("Invalid email or password");
      } else {
        resolve({
          accessToken: "dummy-jwt-token",
          doctor
        });
      }
    }, 800); // simulate network delay
  });
};
