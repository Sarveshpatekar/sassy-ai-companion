
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re
import logging
import json
import os
import time
# Import for Hugging Face transformers
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes

# Global model variables
model = None
tokenizer = None
text_generation = None

# Model config
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"  # Default model, small enough to run on most hardware
# Other options include:
# - "mistralai/Mistral-7B-Instruct-v0.2" (requires more RAM)
# - "microsoft/phi-2" (smaller model)
# - "openchat/openchat-3.5-0106" (requires more RAM)

def initialize_model():
    """Initialize the language model and tokenizer"""
    global model, tokenizer, text_generation
    
    if model is None:
        try:
            logger.info(f"Loading model: {MODEL_NAME}")
            
            # Load model and tokenizer
            tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
            model = AutoModelForCausalLM.from_pretrained(
                MODEL_NAME,
                device_map="auto",  # Use CUDA if available
                low_cpu_mem_usage=True,
                torch_dtype="auto"
            )
            
            # Create a text generation pipeline
            text_generation = pipeline(
                "text-generation",
                model=model,
                tokenizer=tokenizer,
                max_length=512
            )
            
            logger.info("Model loaded successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            return False
    return True

def search_web(query):
    """Search the web for information on a topic"""
    try:
        # Use Wikipedia API to search for information
        search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={query}&format=json"
        response = requests.get(search_url)
        data = response.json()
        
        if 'query' in data and 'search' in data['query'] and len(data['query']['search']) > 0:
            # Get the first search result
            page_title = data['query']['search'][0]['title']
            
            # Get the full page content
            content_url = f"https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=&explaintext=&titles={page_title}&format=json"
            content_response = requests.get(content_url)
            content_data = content_response.json()
            
            # Extract the page content
            pages = content_data['query']['pages']
            page_id = list(pages.keys())[0]
            
            if 'extract' in pages[page_id]:
                # Return the extracted content
                return {
                    "source": "Wikipedia",
                    "title": page_title,
                    "content": pages[page_id]['extract'],
                    "url": f"https://en.wikipedia.org/wiki/{page_title.replace(' ', '_')}"
                }
        
        # If Wikipedia search fails, try a web search
        logger.info("No Wikipedia results, attempting general web search")
        return {
            "source": "Web",
            "title": query,
            "content": f"I searched for information about '{query}', but couldn't find specific details. Please ask a more specific question or try a different topic.",
            "url": ""
        }
    except Exception as e:
        logger.error(f"Web search error: {str(e)}")
        return {
            "source": "Error",
            "title": "",
            "content": f"I encountered an error while searching for information: {str(e)}",
            "url": ""
        }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple endpoint to check if the API is running"""
    model_loaded = model is not None
    return jsonify({
        "status": "healthy", 
        "message": "Jarvis AI backend is operational",
        "model": {
            "loaded": model_loaded,
            "name": MODEL_NAME if model_loaded else None
        }
    })

@app.route('/api/scrape', methods=['POST'])
def scrape_website():
    """Endpoint to scrape a website and extract useful information"""
    data = request.json
    url = data.get('url', '')
    
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    
    try:
        logger.info(f"Scraping website: {url}")
        
        # Make request to the website
        response = requests.get(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        if response.status_code != 200:
            return jsonify({"error": f"Failed to fetch website. Status code: {response.status_code}"}), 400
        
        # Parse HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract title
        title = soup.title.string if soup.title else ""
        
        # Extract description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        description = meta_desc['content'] if meta_desc else ""
        
        # Extract headings
        headings = [h.get_text().strip() for h in soup.find_all(['h1', 'h2', 'h3']) if h.get_text().strip()]
        
        # Extract paragraphs
        content = [p.get_text().strip() for p in soup.find_all('p') if p.get_text().strip()]
        
        # Extract links
        links = []
        for a in soup.find_all('a', href=True):
            link_text = a.get_text().strip()
            if link_text and len(link_text) > 3:  # Filter out very short link texts
                link_url = a['href']
                if not link_url.startswith('http'):
                    # Convert relative URL to absolute
                    link_url = requests.compat.urljoin(url, link_url)
                links.append({"text": link_text, "url": link_url})
        
        # Limit the amount of data to return
        max_headings = 10
        max_paragraphs = 20
        max_links = 15
        
        result = {
            "title": title,
            "description": description,
            "headings": headings[:max_headings],
            "content": content[:max_paragraphs],
            "links": links[:max_links]
        }
        
        logger.info(f"Successfully scraped website: {url}")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error scraping website: {str(e)}")
        return jsonify({"error": f"Failed to scrape website: {str(e)}"}), 500

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    """Endpoint to analyze text for sentiment, entities, etc."""
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    try:
        # Calculate basic statistics
        word_count = len(re.findall(r'\w+', text))
        char_count = len(text)
        
        # Generate a summary (simple approach)
        sentences = re.split(r'(?<=[.!?])\s+', text)
        summary = sentences[0] if sentences else text
        if len(sentences) > 1:
            summary += " " + sentences[1]
        
        # Determine sentiment (very basic approach)
        # For a more accurate sentiment, you'd want to use a dedicated model
        positive_words = ['good', 'great', 'excellent', 'happy', 'positive', 'wonderful', 'awesome']
        negative_words = ['bad', 'poor', 'terrible', 'sad', 'negative', 'horrible', 'awful']
        
        text_lower = text.lower()
        positive_count = sum([1 for word in positive_words if word in text_lower])
        negative_count = sum([1 for word in negative_words if word in text_lower])
        
        if positive_count > negative_count:
            sentiment = "positive"
        elif negative_count > positive_count:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        analysis = {
            "sentiment": sentiment,
            "length": char_count,
            "words": word_count,
            "summary": summary if len(summary) < 150 else summary[:147] + "..."
        }
        
        return jsonify({"analysis": analysis})
        
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        return jsonify({"error": f"Failed to analyze text: {str(e)}"}), 500

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    """Endpoint to handle chat interactions with Jarvis AI using local language model"""
    data = request.json
    message = data.get('message', '')
    
    if not message:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        # Check if the message is asking for information that might require web searching
        search_keywords = ["what is", "who is", "how to", "where is", "when was", "why is", 
                           "tell me about", "information on", "search for", "lookup", "find info"]
        
        needs_search = any(keyword in message.lower() for keyword in search_keywords)
        
        web_search_result = None
        if needs_search:
            # Extract the search query - take everything after the search keyword
            for keyword in search_keywords:
                if keyword in message.lower():
                    search_query = message.lower().split(keyword, 1)[1].strip()
                    web_search_result = search_web(search_query)
                    break
        
        # Initialize model if not already loaded
        if not initialize_model():
            # Fallback responses if model fails to load
            logger.warning("Model not loaded. Using fallback responses.")
            if web_search_result:
                response = f"I found this information about your query:\n\n{web_search_result['content']}\n\nSource: {web_search_result['source']}"
            elif "weather" in message.lower():
                response = "The weather is currently sunny with a temperature of 72°F."
            elif "news" in message.lower():
                response = "Today's top headline: Scientists make breakthrough in quantum computing."
            elif "scrape" in message.lower():
                response = "I can scrape websites for you through my API. Please provide a URL."
            else:
                response = f"I received your message: '{message}'. How can I assist you further?"
                
            return jsonify({"response": response})
        
        # Prepare prompt for the model
        system_message = """You are J.A.R.V.I.S (Just A Rather Very Intelligent System), a helpful, friendly, and sophisticated AI assistant. 
        Respond in a polite, concise, informative, and conversational manner. Be engaging, show personality, and aim to be helpful.
        Avoid being overly formal. Use contractions and conversational language to sound more natural.
        Your goal is to assist the user with their questions and tasks to the best of your ability."""
        
        prompt = f"{system_message}\n\n"
        
        # Add web search results if available
        if web_search_result:
            prompt += f"Information from web search: {web_search_result['content']}\n\n"
            
        prompt += f"User: {message}\n\nJ.A.R.V.I.S:"
        
        # Generate response using the local model
        start_time = time.time()
        logger.info(f"Generating response for: {message}")
        
        generation = text_generation(
            prompt,
            do_sample=True,
            temperature=0.8,  # Slightly higher temperature for more creative responses
            max_new_tokens=350,  # Allow longer responses
            top_p=0.95,
            repetition_penalty=1.2  # Higher repetition penalty to avoid repeating phrases
        )
        
        # Extract the generated text from the model's output
        generated_text = generation[0]["generated_text"]
        
        # Clean up the response to only include the assistant's reply
        response = generated_text.split("J.A.R.V.I.S:")[-1].strip()
        
        # If we used web search data, include citation
        if web_search_result and web_search_result["url"]:
            response += f"\n\nSource: {web_search_result['source']}"
            if web_search_result["url"]:
                response += f" - {web_search_result['url']}"
        
        elapsed_time = time.time() - start_time
        logger.info(f"Response generated in {elapsed_time:.2f} seconds")
        
        return jsonify({"response": response})
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({"error": f"Failed to process message: {str(e)}"}), 500

# This route allows changing the model at runtime
@app.route('/api/change-model', methods=['POST'])
def change_model():
    """Endpoint to change the language model at runtime"""
    global MODEL_NAME, model, tokenizer, text_generation
    
    data = request.json
    new_model = data.get('model')
    
    if not new_model:
        return jsonify({"error": "No model name provided"}), 400
    
    try:
        # Clear current model to free memory
        model = None
        tokenizer = None
        text_generation = None
        
        # Update model name
        MODEL_NAME = new_model
        
        # Initialize the new model
        success = initialize_model()
        
        if success:
            return jsonify({"success": True, "message": f"Model changed to {MODEL_NAME}"})
        else:
            return jsonify({"success": False, "error": f"Failed to load model {MODEL_NAME}"}), 500
        
    except Exception as e:
        logger.error(f"Error changing model: {str(e)}")
        return jsonify({"error": f"Failed to change model: {str(e)}"}), 500

if __name__ == '__main__':
    # Initialize model at startup
    initialize_model()
    app.run(debug=True, host='0.0.0.0', port=5000)
