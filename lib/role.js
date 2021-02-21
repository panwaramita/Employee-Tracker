const inquirer = require('inquirer');
const CreateQuestions = require('../index');
const connect=require('./connection');
const department=require('./department');
const mysql=require('mysql');
//add role
function addRole() {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter the role title?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for the role?'
        },
        {
            name: 'department',
            type: 'list',
            message: 'Select the department for the role?',
            choices: department.getDepartment("name")
        }
    ]).then(answers => {        
    let connection = mysql.createConnection(connect.db_config);   
        const departmentId=department.getDepartment(answers.department);
        const queryIsExist="select title from role where title='"+answers.title+"' and department_id="+departmentId;
        connection.query(queryIsExist,function(err,res)
        {
            if(err) throw err;
            if(res.length)
            {
                console.log(answers.title+" role already exists for the department..");
                CreateQuestions.CreateQuestions();
            }
            else
            {
                const query="insert into role(title,salary,department_id)values('"+answers.title+"',"+answers.salary+","+departmentId+")";
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log("sucessfull insertion.");
                    getRole("name");      
                    CreateQuestions.CreateQuestions();
                });
            }
        })
 });
}
//get role
let roleValues = [];
let role=[];
function getRole(value) {
    let connection = mysql.createConnection(connect.db_config);       
    if (value == "name") {
        roleValues.length=0;
        role.length=0;
      let value=[];
        const query = `select *
    from role`;
        connection.query(query, function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
               roleValues.push(res[i]);
                value.push(res[i].title);
                role.push(res[i].title);
            }
           });
        return (value);
    }
    else if (value == "view") {
        let value=[];
          const query = `select r.id,r.title,r.salary,d.name
          from role r inner join department d
          on r.department_id=d.id
          order by id asc`;
          connection.query(query, function (err, res) {
              if (err) throw err;
              if(res.length)
              {
              for (let i = 0; i < res.length; i++) {
                  value.push({Id:res[i].id,Title:res[i].title,Salary:res[i].salary,Department_name:res[i].name});
              }
  console.table(value);
  CreateQuestions.CreateQuestions();
            }
            else
            {
                console.log("No data of the role");
                CreateQuestions.CreateQuestions();
            }
          });
      }
    else {
        let id="";
       roleValues.forEach(element => {
           if(element.title==value)
           {
            id=element.id;
           }
       });
       return id;
    }
connection.end();
}
// remove role
const removeRole = () => {
    if(role.length)
    {
    inquirer.prompt([
        {
            name: 'roleName',
            type: 'list',
            message: 'Enter the name of the role want to?',
            choices: role
        }
    ]).then(answers => {
        const query = "select id from role where title='" + answers.roleName + "'";
        let connection = mysql.createConnection(connect.db_config);
        let id = 0;
        connection.query(query, function (err, data) {
            if (err) throw err;
            id = data[0].id;
            if (data.length) {
                const queryRole = "select id from employee where role_id=" + id;
                connection.query(queryRole, function (err, data) {
                    if (err) throw err;
                    if (data.length) {
                        console.log("Employee exist for the role.Hence role can not be deleted..");                                                               
    CreateQuestions.CreateQuestions();
                    }
                    else
                    {
                            const query1 = `SET FOREIGN_KEY_CHECKS = 0 ;`
                            const query2 = `delete from role where id=${id}`;
                            connection.query(query1, function (err, res) {
                                if (err) throw err;
                                connection.query(query2, function (err, res) {
                                    if (err) throw err;                                
                                    console.log("Successfully deleted the role\n");
                                    getRole("name");                                                       
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
    console.log("No data of role");
    CreateQuestions.CreateQuestions();
}
}
getRole("name");
module.exports.addRole=addRole;
module.exports.getRole=getRole;
module.exports.removeRole=removeRole;