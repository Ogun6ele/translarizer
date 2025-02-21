export async function detectLanguage(text) {
    if ("ai" in self && "languageDetector" in self.ai) {
      try {
        const detector = await self.ai.languageDetector.create();
        const result = await detector.detect(text);
        return result[0].detectedLanguage || "en";
      } catch (error) {
        console.error("Language detection failed:", error);
        return "en";
      }
    } else {
      console.warn("Language Detector API is not available.");
      return "en";
    }
  }
  
  export async function translateText(text, sourceLang, targetLang) {
    if (!text.trim() || sourceLang === targetLang) return text; 
  
    if ("ai" in self && "translator" in self.ai) {
      try {
        const translator = await self.ai.translator.create({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        });
  
        return await translator.translate(text);
      } catch (error) {
        console.error("Translation failed:", error);
        return text; 
      }
    } else {
      console.warn("Translator API is not available.");
      return text; 
    }
  }

  export async function createSummarizer() {
    if ('ai' in self && 'summarizer' in self.ai) {
      try {
        const capabilities = await self.ai.summarizer.capabilities();
        if (capabilities.available === "no") {
          console.warn("Summarizer API is not available.");
          return null;
        }
        return await self.ai.summarizer.create({
            type: "tl;dr",
            format: "plain-text",
            length: "short",
        });
      } catch (error) {
        console.error("Summarizer creation failed:", error);
        return null;
      }
    } else {
      console.warn("Summarizer API is not supported.");
      return null;
    }
  }
  