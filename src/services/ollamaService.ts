import ollama from "ollama";

export const getCompletion = async (prompt: string) => {
  try {
    const output = await ollama.generate({
      model: "deepseek-r1:7b",
      prompt,
    });

    return output.response;
  } catch (error) {
    console.error("Error fetching completion:", error);
    return "An error occurred while generating a response.";
  }
};

const ollamaService = {
  getCompletion,
};

export default ollamaService;
