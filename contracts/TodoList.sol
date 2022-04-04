// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.12;

contract TodoList {
    uint256 public todosCount = 0;

    struct Todo {
        uint256 id;
        string content;
        bool done;
    }

    event TodoCreated(uint256 indexed id, string content, bool completed);
    event TodoDone(uint256 indexed id, string content, bool completed);

    mapping(uint256 => Todo) public todos;

    function createTodo(string memory _content) public {
        todos[todosCount] = Todo(todosCount, _content, false);
        todosCount = todosCount + 1;
        emit TodoCreated(todosCount, _content, false);
    }

    function markTodoAsDone(uint id) public {
        require(id < todosCount, "id not valid");
        todos[id].done = true ;
        emit TodoDone(id, todos[id].content, true);
        
    }
}
