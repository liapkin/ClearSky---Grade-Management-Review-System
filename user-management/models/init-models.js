var DataTypes = require("sequelize").DataTypes;
var _credentials = require("./credentials");
var _examinations = require("./examinations");
var _grades = require("./grades");
var _institutions = require("./institutions");
var _logs = require("./logs");
var _representatives = require("./representatives");
var _reviews = require("./reviews");
var _students = require("./students");
var _teachers = require("./teachers");
var _tokens = require("./tokens");
var _uploads = require("./uploads");

function initModels(sequelize) {
  var credentials = _credentials(sequelize, DataTypes);
  var examinations = _examinations(sequelize, DataTypes);
  var grades = _grades(sequelize, DataTypes);
  var institutions = _institutions(sequelize, DataTypes);
  var logs = _logs(sequelize, DataTypes);
  var representatives = _representatives(sequelize, DataTypes);
  var reviews = _reviews(sequelize, DataTypes);
  var students = _students(sequelize, DataTypes);
  var teachers = _teachers(sequelize, DataTypes);
  var tokens = _tokens(sequelize, DataTypes);
  var uploads = _uploads(sequelize, DataTypes);

  grades.belongsTo(examinations, { as: "examination", foreignKey: "examination_id"});
  examinations.hasMany(grades, { as: "grades", foreignKey: "examination_id"});
  reviews.belongsTo(grades, { as: "grade", foreignKey: "grade_id"});
  grades.hasMany(reviews, { as: "reviews", foreignKey: "grade_id"});
  representatives.belongsTo(institutions, { as: "institution", foreignKey: "institution_id"});
  institutions.hasMany(representatives, { as: "representatives", foreignKey: "institution_id"});
  students.belongsTo(institutions, { as: "institution", foreignKey: "institution_id"});
  institutions.hasMany(students, { as: "students", foreignKey: "institution_id"});
  teachers.belongsTo(institutions, { as: "institution", foreignKey: "institution_id"});
  institutions.hasMany(teachers, { as: "teachers", foreignKey: "institution_id"});
  grades.belongsTo(students, { as: "student", foreignKey: "student_id"});
  students.hasMany(grades, { as: "grades", foreignKey: "student_id"});
  examinations.belongsTo(teachers, { as: "teacher", foreignKey: "teacher_id"});
  teachers.hasMany(examinations, { as: "examinations", foreignKey: "teacher_id"});

  return {
    credentials,
    examinations,
    grades,
    institutions,
    logs,
    representatives,
    reviews,
    students,
    teachers,
    tokens,
    uploads,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
