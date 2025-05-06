
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
    # ... keep existing code (website scraping functionality)

@app.route('/api/analyze-text', methods=['POST'])
def analyze_text():
    """Endpoint to analyze text for sentiment, entities, etc."""
    # ... keep existing code (text analysis functionality)

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    """Endpoint to handle chat interactions with Jarvis AI using local language model"""
    data = request.json
    message = data.get('message', '')
    
    if not message:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        # Initialize model if not already loaded
        if not initialize_model():
            # Fallback responses if model fails to load
            logger.warning("Model not loaded. Using fallback responses.")
            if "weather" in message.lower():
                response = "The weather is currently sunny with a temperature of 72°F."
            elif "news" in message.lower():
                response = "Today's top headline: Scientists make breakthrough in quantum computing."
            elif "scrape" in message.lower():
                response = "I can scrape websites for you through my API. Please provide a URL."
            else:
                response = f"I received your message: '{message}'. How can I assist you further?"
                
            return jsonify({"response": response})
        
        # Prepare prompt for the model
        system_message = "You are J.A.R.V.I.S (Just A Rather Very Intelligent System), a helpful and sophisticated AI assistant. Respond in a polite, concise, and informative manner."
        prompt = f"{system_message}\n\nUser: {message}\n\nJ.A.R.V.I.S:"
        
        # Generate response using the local model
        start_time = time.time()
        logger.info(f"Generating response for: {message}")
        
        generation = text_generation(
            prompt,
            do_sample=True,
            temperature=0.7,
            max_new_tokens=300,
            top_p=0.95,
            repetition_penalty=1.1
        )
        
        # Extract the generated text from the model's output
        generated_text = generation[0]["generated_text"]
        
        # Clean up the response to only include the assistant's reply
        response = generated_text.split("J.A.R.V.I.S:")[-1].strip()
        
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
