const mongoose = require("mongoose");
const  connections = require("../../mongodb/mongodb.connect"); // Replace with the actual path to your module

// Mock mongoose.connect
mongoose.connect = jest.fn();

describe("connect", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock function calls before each test
  });

  it("should connect to the MongoDB database", async () => {
    // Mock a successful connection
    mongoose.connect.mockResolvedValueOnce();

    await connections.connect();

    // Assert that mongoose.connect was called with the correct arguments
    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://localhost:27017/todo-tdd",
      { useNewUrlParser: true }
    );
  });

  it("should handle connection errors", async () => {
    // Mock a connection error
    const error = new Error("Connection error");
    mongoose.connect.mockRejectedValueOnce(error);

    // Capture console.log and console.error output
    const consoleLogSpy = jest.spyOn(console, "log");
    const consoleErrorSpy = jest.spyOn(console, "error");

    await connections.connect();

    // Assert that mongoose.connect was called with the correct arguments
    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://localhost:27017/todo-tdd",
      { useNewUrlParser: true }
    );

    // Assert that the error message is logged
    expect(consoleLogSpy).toHaveBeenCalledWith(error);

    // Assert that the "Error connecting mongodb" message is logged to stderr
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error connecting mongodb");
  });
});
