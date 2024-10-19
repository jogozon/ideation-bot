interface FetchResponsesParams {
  query: string;
}

export const fetchResponses = async ({ query }: FetchResponsesParams) => {
  try {
    const response = await fetch("YOUR_API_ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }), // Include selected chatbots in the request
    });

    if (!response.ok) {
      throw new Error("Failed to fetch responses");
    }

    const data = await response.json();
    return data.responses; // Adjust based on your API response structure
  } catch (error) {
    console.error("Error fetching responses:", error);
    return [];
  }
};
