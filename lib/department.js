//modules to be added
const inquirer = require('inquirer');
const CreateQuestions = require('../index');
const connect = require('./connection');
const mysql = require('mysql');
const table = require('console.table');
const role = require('./role');
//view department 
let departmentValues = [];
let departmentNameValue = [];
//function to view the department table records
function getDepartment(value) {
    if (value == "name") {
        //create an sql connection
        let connection = mysql.createConnection(connect.db_config);
        departmentValues.length = 0;
        let values = [];
        //create an sql query to get all the records in the department table
        const query = `select *
    from department`;
        //run the sql query
        connection.query(query, function (err, res) {
            if (err) throw err;
            //if the department table contains a records
            for (let i = 0; i < res.length; i++) {
                //push all the values to the array
                departmentValues.push(res[i]);
                //push only the name of the department
                values.push(res[i].name);
                departmentNameValue.push(res[i].name);
            }
        });
        //end the connection
        connection.end();
        //return the values of the department back to the called function
        return (values);
    }
    else if (value == "view") {
        let connection = mysql.createConnection(connect.db_config);
        let values = [];
        //query to get all the department records
        const query = `select *
      from department`;
        //sql query 
        connection.query(query, function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            if (res.length) {
                for (let i = 0; i < res.length; i++) {
                    values.push({ 'id': res[i].id, 'department_Name': res[i].name });
                }
                //display the department table
                console.table(values);
                //ask the questions again
                CreateQuestions.CreateQuestions();
            }
            else {
                //if no data present in the department
                console.log("No data of department");
                //ask the questions again
                CreateQuestions.CreateQuestions();
            }
        });
        //end the connection
        connection.end();
    }
    else {
        //return the id for the perticular department
        let id = "";
        departmentValues.forEach(element => {
            if (element.name == value) {
                id = element.id;
            }
        });
        return id;
    }
}
//add department 
const addDepartment = () => {
    //create the sql connection
    let connection = mysql.createConnection(connect.db_config);
    //prompt for asking questions
    inquirer.prompt([
        {
            name: 'departmentName',
            type: 'input',
            message: 'Enter the name of the department?'
        }
    ]).then(answers => {
        //check if user entered the department or not
        if (answers.departmentName != "") {
            //create a query to check wether the department with the same name already exist or not
            const queryIsExist = "select name from department where name='" + answers.departmentName + "'";
            //create an sql query
            connection.query(queryIsExist, function (err, res) {
                if (err) throw err;
                if (res.length) {
                    //if the res return by the sql is not null
                    console.log(answers.departmentName + " department already exists..");
                    //return to the main questions session
                    CreateQuestions.CreateQuestions();
                }
                else {
                    //if the apartment not exist already then insert ito department table
                    const query = "insert into department(name)values('" + answers.departmentName + "')";
                    //create the query to insert the department into the table
                    connection.query(query, function (err, res) {
                        if (err) throw err;
                        //if department entered display success message 
                        console.log("sucessfull insertion.");
                        getDepartment("name");
                        //get back to the main question 
                        CreateQuestions.CreateQuestions();
                    });
                }
            })
        }
        else {
            //if user does not enter any value display message the department can not be blank
            console.log("Department name can not blank");
            //get back to the questions
            CreateQuestions.CreateQuestions();
        }
    });
}
//remove the specific department 
const removeDepartment = () => {
    if (departmentValues.length) {
        //prompt to ask user to ask which department he wants to delete
        inquirer.prompt([
            {
                name: 'departmentName',
                type: 'list',
                message: 'Enter the name of the department want to?',
                choices: departmentValues
            }
        ]).then(answers => {
            //get the id for the department
            const query = "select id from department where name='" + answers.departmentName + "'";
            //create the sql connection
            let connection = mysql.createConnection(connect.db_config);
            let id = 0;
            //run the sql query
            connection.query(query, function (err, data) {
                if (err) throw err;
                id = data[0].id;
                if (data.length) {
                    //check if the department is attach to any role
                    // if yes then,the user can not delete the department
                    const queryRole = "select id from role where department_id=" + id;
                    //check if the department attach to a role
                    connection.query(queryRole, function (err, data) {
                        if (err) throw err;
                        if (data.length) {
                            //if yes then department can not be deleted
                            console.log("Role exist for the department.Hence Department can not be deleted..");
                            //ask a user questions again
                            CreateQuestions.CreateQuestions();
                        }
                        //if the department not attach to any role
                        //then delete the department
                        else {
                            //delete the department from the department table
                            const query1 = `SET FOREIGN_KEY_CHECKS = 0 ;`
                            const query2 = `delete from department where id=${id}`;
                            //query to set foreign key check 0
                            connection.query(query1, function (err, res) {
                                if (err) throw err;
                                //query to delete the department from the department table
                                connection.query(query2, function (err, res) {
                                    if (err) throw err;
                                    console.log("sucessfull deleted the Department\n");
                                    getDepartment("name");
                                    //return back to ask user main questions
                                    CreateQuestions.CreateQuestions();
                                });
                            });
                        }
                    });
                }
            });
        });
    }
    else {
        //if the depaartment table does not contain any rows
        //then display a message no data for department
        console.log("No data of department");
        //return to the main question segment
        CreateQuestions.CreateQuestions();
    }
}
//View the total utilized budget of a department -- ie the combined salaries of all employees in that department
const salaryBasedOnDepartment = () => {
    //create an sql connection
    let connection = mysql.createConnection(connect.db_config);
    //ask the user to enter the department for which wants to know the total salary
    inquirer.prompt([
        {
            name: 'departmentName',
            type: 'list',
            message: 'Enter the name of the department?',
            choices: departmentValues
        }
    ]).then(answers => {
        //check if the user entered any value or not
        if (answers.departmentName != "") {
            //query to check if the department exist or not
            const queryIsExist = "select id from department where name='" + answers.departmentName + "'";
            connection.query(queryIsExist, function (err, res) {
                if (err) throw err;
                if (res.length) {
                    //if the department exists then get the salary for the role that belongs to that department
                    const queryRole = "select id,salary from role where department_id=" + res[0].id;
                    //run the sql query
                    connection.query(queryRole, function (err, data) {
                        if (err) throw err;
                        //if the department is attach to any role then get the number of employee belongs to that role
                        if (data.length) {
                            let sum = 0;
                            for (let i = 0; i < data.length; i++) {
                                //for each role get the sum of the salary for the employee beolngs to that depaartment
                                const queryTotal = "select count(*) as count from employee where role_id=" + data[i].id;
                                //run the sql query
                                connection.query(queryTotal, function (err, check) {
                                    if (err) throw err;
                                    if (check[0].count > 0) {
                                        sum += (check[0].count * data[i].salary);
                                        if (i == data.length - 1) {
                                            //display the total salary of the employee belongs to that department
                                            console.log("The salary of the employee for the " + answers.departmentName + " deparment is=" + sum);
                                            //return back to the main question segment
                                            CreateQuestions.CreateQuestions();
                                        }
                                    }
                                    // if the department not assign to any employee
                                    else {
                                        if (i == data.length - 1) {
                                            //display a message department not assign to any employee
                                            console.log("department not assign to any employee");
                                            //return back to the main questions segments 
                                            CreateQuestions.CreateQuestions();
                                        }
                                    }
                                })
                            }
                        }
                        //if the department not assign to any role
                        else {
                            //display a message department not assign to any role
                            console.log("department not assign to any role");
                            //return to main question section
                            CreateQuestions.CreateQuestions();
                        }

                    })
                }
            });
        }
    });
}
//function to initialize the array for the department
getDepartment("name");
//export all the department functions
module.exports.addDepartment = addDepartment;
module.exports.getDepartment = getDepartment;
module.exports.removeDepartment = removeDepartment;
module.exports.salaryBasedOnDepartment = salaryBasedOnDepartment;