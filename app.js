const express = require("express");
const app = express();
app.use(express.json());

const format = require("date-fns/format");

const isValid = require("date-fns/isValid");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");

let db;
const initialiseDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: "${e.message}"`);
    process.exit(1);
  }
};

initialiseDBAndServer();

const hasPriorityAndStatusAndCategory = (requestQuery) => {
  return (
    requestQuery.priority !== undefined &&
    requestQuery.status !== undefined &&
    requestQuery.category !== undefined
  );
};

const hasPriorityAndStatus = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityAndCategory = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.category !== undefined
  );
};

const hasStatusAndCategory = (requestQuery) => {
  return (
    requestQuery.status !== undefined && requestQuery.category !== undefined
  );
};

const hasPriority = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatus = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasCategory = (requestQuery) => {
  return requestQuery.category !== undefined;
};

// Invalid scenarios
const invalidScenarios = async (request, response, next) => {
  const requestQuery = request.query;
  if (hasPriority(requestQuery)) {
    if (
      requestQuery.priority === "HIGH" ||
      requestQuery.priority === "LOW" ||
      requestQuery.priority === "MEDIUM"
    ) {
      let d = 2;
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  }

  if (hasStatus(requestQuery)) {
    switch (requestQuery.status) {
      case "TO DO":
        const a = 5;
        break;
      case `IN PROGRESS`:
        break;
      case `DONE`:
        break;
      default:
        response.status(400);
        response.send("Invalid Todo Status");
        break;
    }
  }

  if (hasCategory(requestQuery)) {
    switch (requestQuery.category) {
      case `WORK`:
        break;
      case `HOME`:
        break;
      case `LEARNING`:
        break;
      default:
        response.status(400);
        response.send("Invalid Todo Category");
        break;
    }
  }

  if (requestQuery.dueDate !== undefined) {
    let { date } = request.query;
    const newDate = format(new Date(date), "yyyy-MM-dd");
    const getTodoQuery = `SELECT * FROM  todo WHERE due_date = "${newDate}";`;
    const getUser = await database.get(getTodoQuery);
    if (getUser === undefined) {
      response.status(400);
      response.send("Invalid Due Date");
    }
  }

  next();
};

// API 1
app.get(`/todos/`, async (request, response) => {
  const { status, category, priority, search_q = "" } = request.query;

  const requestQuery = request.query;

  if (hasPriority(requestQuery)) {
    if (
      requestQuery.priority === "HIGH" ||
      requestQuery.priority === "LOW" ||
      requestQuery.priority === "MEDIUM"
    ) {
      console.log("ok");
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  }

  if (hasStatus(requestQuery)) {
    switch (requestQuery.status) {
      case "TO DO":
        const a = 5;
        break;
      case `IN PROGRESS`:
        break;
      case `DONE`:
        break;
      default:
        response.status(400);
        response.send("Invalid Todo Status");
        break;
    }
  }

  if (hasCategory(requestQuery)) {
    switch (requestQuery.category) {
      case `WORK`:
        break;
      case `HOME`:
        break;
      case `LEARNING`:
        break;
      default:
        response.status(400);
        response.send("Invalid Todo Category");
        break;
    }
  }

  if (requestQuery.dueDate !== undefined) {
    let { date } = request.query;
    const newDate = format(new Date(date), "yyyy-MM-dd");
    const getTodoQuery = `SELECT * FROM  todo WHERE due_date = "${newDate}";`;
    const getUser = await db.get(getTodoQuery);
    if (getUser === undefined) {
      response.status(400);
      response.send("Invalid Due Date");
    }
  }

  let getQuery;
  if (hasPriorityAndStatusAndCategory(requestQuery)) {
    getQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate
     FROM todo WHERE priority = "${priority}" AND
      category = "${category}" AND status = "${status}";`;
  } else if (hasPriorityAndStatus(requestQuery)) {
    getQuery = `SELECT 
    id, todo, priority, status, category, due_date AS dueDate
     FROM todo WHERE status = "${status}" AND
       priority = "${priority}";`;
  } else if (hasPriorityAndCategory(requestQuery)) {
    getQuery = `SELECT 
    id, todo, priority, status, category, due_date AS dueDate
     FROM todo WHERE priority = "${priority}" AND 
      category = "${category}";`;
  } else if (hasStatusAndCategory(requestQuery)) {
    getQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate
     FROM todo WHERE status = "${status}" AND
      category = "${category}";`;
  } else if (hasPriority(requestQuery)) {
    getQuery = `SELECT 
    id, todo, priority, status, category, due_date AS dueDate
     FROM todo WHERE priority = "${priority}";`;
  } else if (hasStatus(requestQuery)) {
    getQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate
     FROM todo WHERE status = "${status}";`;
  } else if (hasCategory(requestQuery)) {
    getQuery = `SELECT 
    id, todo, priority, status, category, due_date AS dueDate FROM todo WHERE category = "${category}";`;
  } else if (search_q !== "") {
    getQuery = `SELECT 
    id, todo, priority, status, category, due_date AS dueDate
     FROM todo WHERE todo LIKE "%${search_q}%";`;
  } else {
    getQuery = `SELECT 
    id, todo, priority, status, category, due_date AS dueDate
     FROM todo;`;
  }

  const dbResponse = await db.all(getQuery);
  response.send(dbResponse);
});

// API 2
app.get(`/todos/:todoId/`, async (request, response) => {
  const { todoId } = request.params;

  getTodoQuery = `SELECT id, todo, priority, status, category, due_date AS dueDate FROM todo WHERE id = ${todoId};`;

  const dbResponse = await db.get(getTodoQuery);
  response.send(dbResponse);
});

// API 3
app.get(`/agenda/`, async (request, response) => {
  const { date } = request.query;

  const newDate = format(new Date(date), "yyyy-MM-dd");
  const getTodoQuery = `SELECT 
  id, todo, priority, status, category, due_date AS dueDate
   FROM  todo WHERE due_date = "${newDate}";`;
  const getUser = await db.all(getTodoQuery);

  if (getUser === undefined) {
    response.status(400);
    response.send("Invalid Due Date");
  } else {
    response.send(getUser);
  }
});

// API 4
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;

  const requestQuery = request.body;

  if (hasPriority(requestQuery)) {
    if (
      requestQuery.priority === "HIGH" ||
      requestQuery.priority === "LOW" ||
      requestQuery.priority === "MEDIUM"
    ) {
      console.log("priority parameter OK");
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  }

  if (hasStatus(requestQuery)) {
    switch (requestQuery.status) {
      case "TO DO":
        const a = 5;
        break;
      case `IN PROGRESS`:
        break;
      case `DONE`:
        break;
      default:
        response.status(400);
        response.send("Invalid Todo Status");
        break;
    }
  }

  if (hasCategory(requestQuery)) {
    switch (requestQuery.category) {
      case `WORK`:
        break;
      case `HOME`:
        break;
      case `LEARNING`:
        break;
      default:
        response.status(400);
        response.send("Invalid Todo Category");
        break;
    }
  }

  if (requestQuery.dueDate !== undefined) {
    const isValidDate = isValid(new Date(dueDate));

    if (!isValidDate) {
      response.status(400);
      response.send("Invalid Due Date");
    }
  }

  const createTodoQuery = `INSERT INTO 
    todo (id, todo, priority, status, category, due_date)
    VALUES (${id}, "${todo}", "${priority}", "${status}", "${category}", "${dueDate}");`;

  const dbResponse = await db.run(createTodoQuery);
  response.send("Todo Successfully Added");
});

// API 5
app.put(`/todos/:todoId/`, async (request, response) => {
  const { status, todo, priority, category, dueDate } = request.body;

  const { todoId } = request.params;

  const requestQuery = request.body;

  if (hasPriority(requestQuery)) {
    if (
      requestQuery.priority === "HIGH" ||
      requestQuery.priority === "LOW" ||
      requestQuery.priority === "MEDIUM"
    ) {
      console.log("priority parameter OK");
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  }

  if (hasStatus(requestQuery)) {
    switch (requestQuery.status) {
      case "TO DO":
        const a = 5;
        break;
      case `IN PROGRESS`:
        break;
      case `DONE`:
        break;
      default:
        response.status(400);
        response.send("Invalid Todo Status");
        break;
    }
  }

  if (hasCategory(requestQuery)) {
    switch (requestQuery.category) {
      case `WORK`:
        break;
      case `HOME`:
        break;
      case `LEARNING`:
        break;
      default:
        response.status(400);
        response.send("Invalid Todo Category");
        break;
    }
  }

  if (requestQuery.dueDate !== undefined) {
    const isValidDate = isValid(new Date(dueDate));

    if (!isValidDate) {
      response.status(400);
      response.send("Invalid Due Date");
    }
  }

  let updatedColumn;

  let query;
  if (status !== undefined) {
    query = `UPDATE todo 
        SET status = "${status}" WHERE id = ${todoId};`;
    updatedColumn = "Status";
  } else if (todo !== undefined) {
    query = `UPDATE todo 
        SET todo = "${todo}" WHERE id = ${todoId};`;
    updatedColumn = "Todo";
  } else if (priority !== undefined) {
    query = `UPDATE todo 
        SET priority = "${priority}" WHERE id = ${todoId};`;
    updatedColumn = "Priority";
  } else if (category !== undefined) {
    query = `UPDATE todo 
        SET category = "${category}" WHERE id = ${todoId};`;
    updatedColumn = "Category";
  } else if (dueDate !== undefined) {
    query = `UPDATE todo 
        SET due_date = "${dueDate}" WHERE id = ${todoId};`;
    updatedColumn = "Due Date";
  }

  const dbResponse = await db.run(query);
  response.send(`${updatedColumn} Updated`);
});

// API 6
app.delete(`/todos/:todoId/`, async (request, response) => {
  const { todoId } = request.params;

  const deleteQuery = `DELETE FROM todo WHERE id = ${todoId};`;

  const dbResponse = await db.run(deleteQuery);
  response.send("Todo Deleted");
});

module.exports = app;

