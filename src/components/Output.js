import React from "react";
const Output = ({ data }) => {
  console.log(data);
  const { stdout, error, stderr } = data;
  return (
    <div className="output-window" id="output-window">
      <h3>OUTPUT WINDOW</h3>
      {/* {console.log("OUtput components data", data.data)} */}
      {stdout && <pre>{stdout}</pre>}
      {error && <div className="error">{error}</div>}
      {error && (
        <p>
          {" "}
          `${error} ${stderr}`
        </p>
      )}
    </div>
  );
};

export default Output;
