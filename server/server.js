const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');


let todos = [
    
];

const typeDefs = gql`
    type Todo {
        id: String
        text: String
        completed: Boolean
        isEditing: Boolean
    }
    type Query {
        todos: [Todo]!
    }
    type Mutation {
        createTodo(text: String!): String
        removeTodo(id: String!): String
        completeTodo(id: String!):String
        editBtnPress(id: String!):String
        updateTodo(id: String!, text: String!): String
    }
`;

const resolvers = {
    Query: {
        todos: () => todos,
    },
    Mutation: {
        createTodo: (parent, args, context, info) => {
            return todos.push({
                id: Date.now().toString(),
                text: args.text,
                completed: false,
                isEditing: false,
            });
        },
        removeTodo: (parent, args, context, info) => {
            for (let i in todos) {
                if (todos[i].id === args.id) {
                    todos.splice(i, 1);
                }
            }
            return args.id;
        },
        completeTodo: (parent, args, context, info) => {
            for (let i in todos) {
                if (todos[i].id === args.id) {
                    todos[i].completed = !todos[i].completed;
                }
            }
            return args.id;
        },
        editBtnPress: (parent, args, context, info) => {
            for (let i in todos) {
                if (todos[i].id === args.id) {
                    if(!todos[i].completed){
                        todos[i].isEditing = !todos[i].isEditing;
                    }
                    else{
                        console.log("Already complete task can't be edited, but it can be deleted")
                    }
                }
            }
            return args.id;
        },
        updateTodo: (parent, args, context, info) => {
            for (let i in todos) {
                if (todos[i].id === args.id) {
                    todos[i].text = args.text
                    todos[i].isEditing = !todos[i].isEditing;
                }
            }
            return args.id;
        }
    }
};

const server = new ApolloServer({typeDefs, resolvers});

const app = express();
server.applyMiddleware({app});

app.use(cors());

app.listen({ port: 4001 }, () => 
    console.log('now browse tp http://localhost:4001' + server.graphqlPath)
)