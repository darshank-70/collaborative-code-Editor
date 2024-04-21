# Collaborative Code Editor

A web application that allows multiple users to collaborate in real-time on code editing, execution, and communication within a shared workspace.

## Features

- Real-time code synchronization using _Socket.IO_.
- Support for multiple programming languages: JavaScript, Python, Java, and C
- Code execution with live output using _Glot.io API_.
- Customizable editor themes with _CodeMirror_.
- Real-time chat functionality for communication among users.

## Installation

1. Clone the repository:
`git clone https://github.com/darshank-70/collaborative-code-Editor.git`

2. Navigate to the project directory:
```cd collaborative-code-Editor```

3. Install dependencies:
`npm install`

4. Start the application:
```npm start```

5. Access the application in your web browser at `http://localhost:3000`

## Usage

- Open the application in a web browser.
- Enter a room ID to join an existing room or create a new one.
- Share the room ID with others to invite them to join.
- Select a programming language from the available options.
- Collaboratively edit code in real-time.
- Run the code and view the output.
- Use the chat feature to communicate with other users in real-time.

## Dependencies

- `codemirror`: ^5.65.16
- `driver.js`: ^1.3.1
- `node-fetch`: ^3.3.2
- `react`: ^18.2.0
- `react-avatar`: ^5.0.3
- `react-dom`: ^18.2.0
- `react-hot-toast`: ^2.4.1
- `react-router-dom`: ^6.22.0
- `react-scripts`: 5.0.1
- `socket.io`: ^4.7.4
- `socket.io-client`: ^4.7.4
- `uuid`: ^9.0.1

## Code Compilation API

The project includes a code compilation API that allows users to compile and run code in various programming languages. The API listens for **POST** requests to the `/compile` endpoint and expects the following **JSON payload**:

```json
{
  "language": "<programming_language>",
  "files": [
    {
      "name": "<file_name>",
      "content": "<file_content>"
    }
  ],
  "stdin": "<standard_input>"
}
```
Here is an example of how to use the code compilation API:
```bash
curl -X POST http://localhost:9000/compile \
    -H "Content-Type: application/json" \
    -d '{
        "language": "python",
        "files": [
            {
                "name": "main.py",
                "content": "print(\"Hello, World!\")"
            }
        ]
    }'
```


## Contributing

Contributions to the project are welcome! 

### Contributors

1. Darshan K
2. Jeevankumar J E

## Acknowledgments

Special thanks to the developers of CodeMirror, Socket.IO, Glot.io, and other libraries used in this project.

## Contact

For any inquiries or support, please contact: 
Darshan K at [darshankdarsh01@gmail.com](mailto:darshankdarsh01@gmail.com) or
Jeevankumar J E at [jeevankumarje07@gmail.com](mailto:jeevankumarje07@gmail.com) .
