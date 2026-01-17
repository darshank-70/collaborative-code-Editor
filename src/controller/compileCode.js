const compileCode = async (code, language, filename, stdin) => {
  console.log(code);
  try {
    const response = await fetch("/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.GLOT_API_KEY,
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
