const inquirer = require('inquirer');
const CreateQuestions = require('../index');
const connect = require('./connection');
const mysql = require('mysql');
const table = require('console.table');
const role = require('./role');
//view department
let departmentValues = [];
let departmentNameValue = [];
function getDepartment(value) {
    if (value == "name") {
        let connection = mysql.createConnection(connect.db_config);
        departmentValues.length = 0;
        let values = [];
        const query = `select *
    from department`;
        connection.query(query, function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                departmentValues.push(res[i]);
                values.push(res[i].name);
                departmentNameValue.push(res[i].name);
            }
        });
        connection.end();
        return (values);
    }
    else if (value == "view") {
        let connection = mysql.createConnection(connect.db_config);
        let values = [];
        const query = `select *
      from department`;
        connection.query(query, function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            if(res.length)
            {
            for (let i = 0; i < res.length; i++) {
                values.push({ 'id': res[i].id, 'department_Name': res[i].name });
            }
            console.table(values);
            CreateQuestions.CreateQuestions();
        }
        else
        {
            console.log("No data of department");
            CreateQuestions.CreateQuestions();
        }
        });
        connection.end();
    }
    else {
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
    let connection = mysql.createConnection(connect.db_config);
    inquirer.prompt([
        {
            name: 'departmentName',
            type: 'input',
            message: 'Enter the name of the department?'
        }
    ]).then(answers => {
        if (answers.departmentName != "") {
            const queryIsExist = "select name from department where name='" + answers.departmentName + "'";
            connection.query(queryIsExist, function (err, res) {
                if (err) throw err;
                if (res.length) {
                    console.log(answers.departmentName + " department already exists..");
                    CreateQuestions.CreateQuestions();
                }
                else {
                    const query = "insert into department(name)values('" + answers.departmentName + "')";
                    connection.query(query, function (err, res) {
                        if (err) throw err;
                        console.log("sucessfull insertion.");
                        getDepartment("name");
                        CreateQuestions.CreateQuestions();
                    });
                }
            })
        }
        else {
            console.log("Department name can not blank");
            CreateQuestions.CreateQuestions();
        }
    });
}
//remove department
const removeDepartment = () => {
    if(departmentValues.length)
    {
    inquirer.prompt([
        {
            name: 'departmentName',
            type: 'list',
            message: 'Enter the name of the department want to?',
            choices: departmentValues
        }
    ]).then(answers => {
        const query = "select id from department where name='" + answers.departmentName + "'";
        let connection = mysql.createConnection(connect.db_config);
        let id = 0;
        connection.query(query, function (err, data) {
            if (err) throw err;
            id = data[0].id;
            if (data.length) {
                const queryRole = "select id from role where department_id=" + id;
                connection.query(queryRole, function (err, data) {
                    if (err) throw err;
                    if (data.length) {
                        console.log("Role exist for the department.Hence Department can not be deleted..");
                        CreateQuestions.CreateQuestions();
                    }
                    else {
                        const query1 = `SET FOREIGN_KEY_CHECKS = 0 ;`
                        const query2 = `delete from department where id=${id}`;
                        connection.query(query1, function (err, res) {
                            if (err) throw err;
                            connection.query(query2, function (err, res) {
                                if (err) throw err;
                                console.log("sucessfull deleted the Department\n");
                                getDepartment("name");
                                CreateQuestions.CreateQuestions();
                            });
                        });
                    }
                });
            }
        });
    });
}
else
{
    console.log("No data of department");
    CreateQuestions.CreateQuestions();
}
}
//View the total utilized budget of a department -- ie the combined salaries of all employees in that department
const salaryBasedOnDepartment = () => {
    let connection = mysql.createConnection(connect.db_config);
    inquirer.prompt([
        {
            name: 'departmentName',
            type: 'list',
            message: 'Enter the name of the department want to?',
            choices: departmentValues
        }
    ]).then(answers => {
        if (answers.departmentName != "") {
            const queryIsExist = "select id from department where name='" + answers.departmentName + "'";
            connection.query(queryIsExist, function (err, res) {
                if (err) throw err;
                if (res.length) {
                    const queryRole = "select id,salary from role where department_id=" + res[0].id;
                    connection.query(queryRole, function (err, data) {
                        if (err) throw err;
                        if (data.length) {
                            let sum = 0;
                            for(let i=0;i<data.length;i++)
                            {
                                const queryTotal = "select count(*) as count from employee where role_id=" + data[i].id;
                                connection.query(queryTotal, function (err, check) {  
                                    if (err) throw err;   
                                    if (check[0].count>0) {
                                        sum += (check[0].count * data[i].salary);
                                        if(i==data.length-1)
                                        {
                                        console.log("The salary of the employee for the "+answers.departmentName+" deparment is="+sum);
                                        CreateQuestions.CreateQuestions();
                                        }
                                    }
                                    else {
                                        if(i==data.length-1)
                                        {
                                        console.log("department not assign to any employee");
                                        CreateQuestions.CreateQuestions();
                                        }
                                    }   
                                })
                            }
                        }
                        else {
                            console.log("department not assign to any role");
                            CreateQuestions.CreateQuestions();
                        }

                    })
                }
            });
        }
    });
}
        getDepartment("name");
        module.exports.addDepartment = addDepartment;
        module.exports.getDepartment = getDepartment;
        module.exports.removeDepartment = removeDepartment;
        module.exports.salaryBasedOnDepartment = salaryBasedOnDepartment;