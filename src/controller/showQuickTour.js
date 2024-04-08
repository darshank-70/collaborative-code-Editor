import { driver } from "driver.js";
import "driver.js/dist/driver.css";
const showQuickTour = () => {
  const driverObj = driver({
    showButtons: ["next", "previous", "close"],
    steps: [
      {
        element: "#language-driver",
        popover: {
          title: "Programming Languages 💻",
          description: "Select the language from List.",
        },
      }, //selecting Language.
      {
        element: "#stdin-driver",
        popover: {
          title: "Standard Inputs",
          description:
            "If your Program has some inputs, provide them at once with space between each. If there is none, leave empty",
        },
      }, //providing Standard Input
      {
        element: "#run-driver",
        popover: {
          title: "run your code ⚙",
        },
      }, //run code
      {
        element: "#output-driver",
        popover: {
          title: "Output Window 🖥",
          description: "The output Appears here..",
        },
      },
      {
        element: "#chat-driver",
        popover: {
          title: "Chat Window 💬",
          description:
            "Here You can Chat with People present in the room in realtime. ",
        },
      }, //output window
      {
        element: "#code-driver",
        popover: {
          title: "Start Coding...",
          description: "👨‍💻",
        },
      },
    ],
  });
  driverObj.drive();
};
export default showQuickTour;
