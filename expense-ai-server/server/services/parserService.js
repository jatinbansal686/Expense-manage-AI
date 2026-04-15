exports.parseJSON = (text) => {
  try {
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    return null;
  }
};