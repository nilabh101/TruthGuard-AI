const API_BASE_URL = "http://127.0.0.1:8000/analyze";

export async function analyzeText(text: string) {
  const response = await fetch(`${API_BASE_URL}/text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Text analysis failed");
  }

  return response.json();
}

export async function analyzeImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image analysis failed");
  }

  return response.json();
}

export async function analyzeVideo(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/video`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Video analysis failed");
  }

  return response.json();
}
