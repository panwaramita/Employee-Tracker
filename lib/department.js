//add department
const inquirer = require('inquirer');
const CreateQuestions = require('../index');
const connect=require('./connection');
const mysql=require('mysql');

const addDepartment=()=>{   
    let connection = mysql.createConnection(connect.db_config);   
    inquirer.prompt([
        {
            name: 'departmentName',
            type: 'input',
            message: 'Enter the name of the department?'
        }
    ]).then(answers => {   
        const queryIsExist="select name from department where name='"+answers.departmentName+"'";
        connection.query(queryIsExist,function(err,res)
        {
            if(err) throw err;
            if(res.length)
            {
                console.log(answers.departmentName+" department already exists..");
                CreateQuestions.CreateQuestions();
            }
            else
            {
                const query="insert into department(name)values('"+answers.departmentName+"')";
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log("sucessfull insertion.");
                    CreateQuestions.CreateQuestions();
                });
            }
        })
   
    });
 //connection.end();    
}
//view department
let departmentValues = [];
function getDepartment(value) {
    let connection = mysql.createConnection(connect.db_config);     
    if (value == "name") {
      let values=[];
        const query = `select *
    from department`;
        connection.query(query, function (err, res) {
            if (err) throw err;          
            for (let i = 0; i < res.length; i++) {
                departmentValues.push(res[i]);
                values.push(res[i].name);
            }
        });
        return (values);
    }
    else if (value == "view") {
        let values=[];
          const query = `select *
      from department`;
          connection.query(query, function (err, res) {
              if (err) throw err;
              // Log all results of the SELECT statement
              for (let i = 0; i < res.length; i++) {
                  values.push({id:res[i].id,department_Name:res[i].name});
              }
              console.table(values);
              CreateQuestions.CreateQuestions();
          });
      }
    else {
        let id="";
        departmentValues.forEach(element => {
           if(element.name==value)
           {
            id=element.id;
           }
       });
       return id;
    }
    connection.end();
}
module.exports.addDepartment=addDepartment;
module.exports.getDepartment=getDepartment;