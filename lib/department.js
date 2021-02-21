//add department
const inquirer = require('inquirer');
const CreateQuestions = require('../index');
const connect = require('./connection');
const mysql = require('mysql');
const table = require('console.table');
const role = require('./role');
const Choices = require('inquirer/lib/objects/choices');
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
            for (let i = 0; i < res.length; i++) {
                values.push({ 'id': res[i].id, 'department_Name': res[i].name });
            }
            console.table(values);
            CreateQuestions.CreateQuestions();
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

    //connection.end();    
}
const removeDepartment = () => {
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
                    else
                    {
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
getDepartment("name");
module.exports.addDepartment = addDepartment;
module.exports.getDepartment = getDepartment;
module.exports.removeDepartment = removeDepartment;