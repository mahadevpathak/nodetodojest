const todoController =require('../../controllers/todo.controller');
const todoModel =require('../../model/todo.model')
const httpMocks =require("node-mocks-http")
const newTodo=require('../../test/mock-data/new-todo.json')
const allTodo=require('../../test/mock-data/all-todos.json');
const { raw } = require('express');


todoModel.create = jest.fn();
todoModel.find = jest.fn();
todoModel.findById = jest.fn();
todoModel.findByIdAndUpdate =jest.fn();
todoModel.findByIdAndDelete =jest.fn();

let req,res,next;
beforeEach(()=>{
  
    req=httpMocks.createRequest()
    res=httpMocks.createResponse()
    next=jest.fn();
})

describe("ToDo Controller getTodo by id",()=>{
    it("should have gettodo function by id",async()=>{
        expect(typeof todoController.getTodoById).toBe("function")
    })
    it("should have gettodo function by id with route param",async()=>{
        req.params.todoId ="651bf65dbdb0968a3dd1536c"
        await todoController.getTodoById(req,res,next)
        expect(todoModel.findById).toBeCalledWith("651bf65dbdb0968a3dd1536c")
    })
    it("should return json body and 200",async()=>{
        todoModel.findById.mockReturnValue(newTodo)
        await todoController.getTodoById(req,res,next)
        expect(res.statusCode).toBe(200);
        
    })
    it("handle error 500 for get by id ",async()=>{
        const erroMessage = {message:"some thing wend wrong"};
        const rejectedPromises=Promise.reject(erroMessage);
        todoModel.findById.mockReturnValue(rejectedPromises);
        await todoController.getTodoById(req,res,next)
        expect(next).toBeCalledWith(erroMessage)
    })
     
    it("Should return 404 when item not exist in database",async()=>{
        todoModel.findById.mockReturnValue(null);
        await todoController.getTodoById(req,res,next);
        expect(res.statusCode).toBe(404)
    })

})   
describe("ToDo Controller getTodo",()=>{
    it("should have gettodo function",async()=>{
        expect(typeof todoController.getTodo).toBe("function")
    })

    it("should call todmodel .find",async()=>{
        await todoController.getTodo(req,res,next)
      expect(todoModel.find).toBeCalledWith({})
    })

    it("should return status with 200 and response",async()=>{
        todoModel.find.mockReturnValue(allTodo)
        await todoController.getTodo(req,res,next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(allTodo)
    })
    it("should handle error for getTodo",async()=>{
        const erroMessage = {message:"some thing wend wrong"};
        const rejectedPromises=Promise.reject(erroMessage);
        todoModel.find.mockReturnValue(rejectedPromises);
        await todoController.getTodo(req,res,next)
        expect(next).toBeCalledWith(erroMessage)
    })
})

describe("ToDo Controller createToDo",()=>{
    beforeEach(()=>{
        req.body =newTodo 
    })
    it("it should have create todo function",()=>{
        expect(typeof todoController.createTodo).toBe("function")
    })
    
    it("it should call todomodel.create",()=>{
        
       // req.body =newTodo
        todoController.createTodo(req,res,next);
        expect(todoModel.create).toBeCalledWith(newTodo);
    })

    it("should return 201 response code",async()=>{
        //req.body=newTodo;
       await todoController.createTodo(req,res,next);
        expect(res.statusCode).toBe(201)
    })

    it("should return json body in response",async()=>{
      todoModel.create.mockReturnValue(newTodo);
      await todoController.createTodo(req,res,next);
      expect(res._getJSONData()).toStrictEqual(newTodo)
    })

    it("should handle errors",async()=>{
        const erroMessage = {message:"some fields missing"};
        const rejectedPromises=Promise.reject(erroMessage);
        todoModel.create.mockReturnValue(rejectedPromises);
        await todoController.createTodo(req,res,next)
        expect(next).toBeCalledWith(erroMessage)
      })

})

describe("ToDo Controller Update",()=>{
    it(" it shouuld have udpdate method",async()=>{
        expect(typeof todoController.updateTodo).toBe("function")
    })

    it(" it shouuld have udpdate method with findByID",async()=>{
        req.params.todoId ="651bf65dbdb0968a3dd1536c"
        req.body = newTodo
        await todoController.updateTodo(req,res,next);
       
        expect(todoModel.findByIdAndUpdate).toHaveBeenCalledWith(req.params.todoId,newTodo,{
            new:true,
            useFindAndModify:false
        })
    })

    it(" it shouuld have udpdate method with findByID and status 200",async()=>{
        req.params.todoId ="651bf65dbdb0968a3dd1536c"
        req.body = newTodo
        todoModel.findByIdAndUpdate.mockReturnValue(newTodo)
        await todoController.updateTodo(req,res,next);
        expect(res._getJSONData()).toStrictEqual(newTodo)
        expect(res.statusCode).toBe(200);

    })

    it("should handle error for UpdateTodo",async()=>{
        const erroMessage = {message:"some thing wend wrong"};
        const rejectedPromises=Promise.reject(erroMessage);
        todoModel.findByIdAndUpdate.mockReturnValue(rejectedPromises);
        await todoController.updateTodo(req,res,next)
        expect(next).toBeCalledWith(erroMessage)
    })
    it("should handle 404",async()=>{
       todoModel.findByIdAndUpdate.mockReturnValue(null)
       await todoController.updateTodo(req,res,next)
       expect(res.statusCode).toBe(404)
    })
})

describe("TodoController.deleteTodo",()=>{
    it("should have a delete function", ()=>{
        expect(typeof todoController.deleteTodo).toBe("function")
    })

    it("Should delete it  by id",async()=>{
     req.params.todoId ="651bf65dbdb0968a3dd1536c";
     await todoController.deleteTodo(req,res,next);
     expect(todoModel.findByIdAndDelete).toBeCalledWith(req.params.todoId)
    })

    it("Should delete it  by id and 200 status",async()=>{
        todoModel.findByIdAndDelete.mockReturnValue(newTodo)
        await todoController.deleteTodo(req,res,next);
        expect(res._getJSONData()).toStrictEqual(newTodo)
        expect(res.statusCode).toBe(200);
       })

       it("should handle errors",async()=>{
        const erroMessage = {message:"some fields missing"};
        const rejectedPromises=Promise.reject(erroMessage);
        todoModel.findByIdAndDelete.mockReturnValue(rejectedPromises);
        await todoController.deleteTodo(req,res,next)
        expect(next).toBeCalledWith(erroMessage)
      })

    //   it("should handle 404 in deleteTodo",async()=>{
    //     todoModel.findByIdAndUpdate.mockReturnValue(null)
    //     await todoController.deleteTodo(req,res,next)
    //     expect(res.statusCode).toBe(404)
    //  })

       

})

 