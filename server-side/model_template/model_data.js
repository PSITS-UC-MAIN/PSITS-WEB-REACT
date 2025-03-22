const admin_model = (admin) => {
  return {
    id_number: admin.id_number,
    name: admin.name,
    email: admin.email,
    course: admin.course,
    year: admin.year,
    role: "Admin",
    position: admin.position,
    campus: admin.campus,
  };
};
const user_model = (user) => {
  return {
    id_number: user.id_number,
    name: user.first_name + " " + user.middle_name + " " + user.last_name,
    email: user.email,
    course: user.course,
    year: user.year,
    role: "Student",
    position: "Student",
    audience: user.audience,
    campus: user.campus,
  };
};

module.exports = { admin_model, user_model };
