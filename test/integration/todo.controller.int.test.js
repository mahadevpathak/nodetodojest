const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");
const endpointUrl = "/todos/";

let firstTodo, newTodoID;
describe(endpointUrl, () => {
  test("GET" + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl);
    expect(response.statusCode).toBe(200);
    //expect(typeof response.body).toBe("array")
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firstTodo = response.body[0];
  });
  test("GET Todo ById" + endpointUrl + ":todoId", async () => {
    const response = await request(app).get(endpointUrl + firstTodo._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });

  it("post " + endpointUrl, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    newTodoID = response.body._id;
  });

  it("should return error 500 on malforfmed data" + endpointUrl, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({ title: "Missing Done Property" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "Todo validation failed: done: Path `done` is required.",
    });
  });

  it("PUT" + endpointUrl, async () => {
    const testData = { title: "Make integration data fot put", done: true };
    const res = await request(app)
      .put(endpointUrl + newTodoID)
      .send(testData);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.done).toBe(testData.done);
  });

  test("HTTP Delete", async()=>{
    const testData = { title: "Make integration data fot put", done: true };
    const res = await request(app).delete(endpointUrl +newTodoID).send();
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.done).toBe(testData.done); 
  } )
});
