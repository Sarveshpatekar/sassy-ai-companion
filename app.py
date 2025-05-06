
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all domains on all routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple endpoint to check if the API is running"""
    return jsonify({"status": "healthy", "message": "Jarvis AI backend is operational"})

@app.route('/api/scrape', methods=['POST'])
def scrape_website():
    """Endpoint to scrape a website and extract useful information"""
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            return jsonify({"error": f"Failed to fetch website: HTTP {response.status_code}"}), 400
        
        html_content = response.text
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Extract title
        title = soup.title.string if soup.title else "No title found"
        
        # Extract meta description
        meta_desc = ""
        meta_tag = soup.find("meta", attrs={"name": "description"})
        if meta_tag and "content" in meta_tag.attrs:
            meta_desc = meta_tag["content"]
        
        # Extract h1 headings
        h1_tags = [h1.get_text().strip() for h1 in soup.find_all('h1') if h1.get_text().strip()]
        
        # Extract main text content (first few paragraphs)
        paragraphs = [p.get_text().strip() for p in soup.find_all('p')[:5] if p.get_text().strip()]
        
        # Extract links
        links = [{"text": a.get_text().strip(), "url": a["href"]} 
                for a in soup.find_all('a', href=True)
                if a.get_text().strip() and a["href"].startswith(('http', 'https'))][:10]
        
        return jsonify({
            "title": title,
            "description": meta_desc,
            "headings": h1_tags[:5],  # Limit to 5 headings
            "content": paragraphs,
            "links": links
        })
    
    except Exception as e:
        logger.error(f"Error scraping {url}: {str(e)}")
        return jsonify({"error": f"Failed to scrape website: {str(e)}"}), 500

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    """Endpoint to analyze text for sentiment, entities, etc."""
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    try:
        # Placeholder for text analysis functionality
        # In a real implementation, you would integrate with NLP libraries
        # like spaCy, NLTK, or API services like Google NLP, etc.
        
        # Mock response for demonstration
        result = {
            "analysis": {
                "sentiment": "positive",
                "length": len(text),
                "words": len(text.split()),
                "summary": text[:100] + "..." if len(text) > 100 else text
            }
        }
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        return jsonify({"error": f"Failed to analyze text: {str(e)}"}), 500

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    """Endpoint to handle chat interactions with Jarvis AI"""
    data = request.json
    message = data.get('message', '')
    
    if not message:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        # This would typically connect to an LLM service
        # For now, we'll simulate a simple response
        
        if "weather" in message.lower():
            response = "The weather is currently sunny with a temperature of 72°F."
        elif "news" in message.lower():
            response = "Today's top headline: Scientists make breakthrough in quantum computing."
        elif "scrape" in message.lower():
            response = "I can scrape websites for you through my API. Please provide a URL."
        else:
            response = f"I received your message: '{message}'. How can I assist you further?"
            
        return jsonify({"response": response})
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({"error": f"Failed to process message: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
