const compileCode = async (code, language, filename, stdin) => {
  console.log(code);
  try {
    const response = await fetch("http://localhost:9000/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "b0e0ee4f-07b8-4206-a631-112e16b75234", // Replace with your Glot.io API token
      },
      body: JSON.stringify({
        language: language,
        stdin: stdin,
        files: [
          {
            name: filename,
            content: code,
          },
        ],
      }),
    });
    const data = await response.json();
    // if (response.ok) {
    //   console.log("OUTPUTTTTTTTT:", data);
    console.log("APIs data", data);
    return data;
    //we need all 3 stdout,error,stderr

    // setCompiledCode(data.stdout);
    // setError(data.error);
    //   setStdErr(data.stderr);
    // } else {
    //   setError(data.stderr);
    //   setStdErr(data.stderr);
    // }
  } catch (error) {
    return "An error occurred while compiling the code.";
  }
};
export default compileCode;
