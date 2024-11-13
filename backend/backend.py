from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import PyPDF2
import google.generativeai as genai
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS , cross_origin # Add CORS support for cross-origin requests
import logging



# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS
load_dotenv()

# Configure Gemini API
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    logger.error(f"Failed to configure Gemini API: {str(e)}")
    raise

def get_gemini_response(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"Gemini API error: {str(e)}")
        raise

@app.route('/test', methods=['GET'])
@cross_origin()
def test_endpoint():
    """Test endpoint to verify API is working"""
    return jsonify({'status': 'ok', 'message': 'API is running'})

@app.route('/api/ats/analyze', methods=['POST'])
@cross_origin()
def analyze_resume():
    try:
        logger.info("Received ATS analysis request")
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        if 'jd' not in request.form:
            return jsonify({'error': 'No job description provided'}), 400

        resume_file = request.files['resume']
        jd = request.form['jd']
        
        # Validate file type
        if not resume_file.filename.endswith('.pdf'):
            return jsonify({'error': 'Please upload a PDF file'}), 400

        # Extract text from PDF
        try:
            reader = PyPDF2.PdfReader(resume_file)
            text = ""
            for page in reader.pages:
                text += str(page.extract_text())
        except Exception as e:
            logger.error(f"PDF reading error: {str(e)}")
            return jsonify({'error': 'Failed to read PDF file'}), 400

        # Generate analysis using Gemini
        input_prompt = f"""
        Act as an expert ATS (Applicant Tracking System) analyzer with deep understanding of 
        technical fields including software engineering, data science, data analysis, and 
        big data engineering. Evaluate the following resume against the job description.
        
        Resume: {text}
        Job Description: {jd}
        
        Provide the following analysis in JSON format:
        1. JD Match: Percentage match between resume and job description
        2. Missing Keywords: List of important keywords from JD missing in resume
        3. Profile Summary: Brief evaluation of the candidate's profile
        """
        
        response = get_gemini_response(input_prompt)
        logger.info("Successfully analyzed resume")
        return jsonify({'analysis': response})
    except Exception as e:
        logger.error(f"Error in analyze_resume: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/interview/chat', methods=['POST'])
@cross_origin()
def chat_interview():
    try:
        data = request.json
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400

        position = data.get('position', 'software developer')
        context = data.get('context', [])
        
        prompt = f"""
        You are a technical interviewer for a {position} role. Continue the interview based on the following:

        Previous conversation: {context}
        Candidate Name: {data['name']}
        Candidate's response: {data['message']}

        If this is the first message, greet the candidate and ask an initial technical question.
        Otherwise, evaluate the response and proceed with the next question.
        """


        print(prompt)
        response = get_gemini_response(prompt)
        return jsonify({'response': response})
    except Exception as e:
        logger.error(f"Error in chat_interview: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/behavioral/chat', methods=['POST'])
@cross_origin()
def chat_behavioral():
    try:
        data = request.json
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400

        position = data.get('position', 'software developer')
        context = data.get('context', [])
        
        prompt = f"""
        You are an HR interviewer for a {position} position. Continue a behavioral interview with the candidate.

        Previous conversation: {context}
        Candidate Name: {data['name']}
        Candidate's response: {data['message']}

        If this is the first message, greet the candidate and start with a behavioral question.
        Otherwise, evaluate the response and ask the next question.
        """

        
        response = get_gemini_response(prompt)
        return jsonify({'response': response})
    except Exception as e:
        logger.error(f"Error in chat_behavioral: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs/search', methods=['GET'])
@cross_origin()
def search_jobs():
    try:
        keyword = request.args.get('keyword')
        location = request.args.get('location')
        
        if not keyword or not location:
            return jsonify({'error': 'Both keyword and location are required'}), 400

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # URL encode parameters
        keyword = requests.utils.quote(keyword)
        location = requests.utils.quote(location)
        url = f"https://www.linkedin.com/jobs/search?keywords={keyword}&location={location}"
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        jobs = []
        
        for job_card in soup.find_all('div', class_='base-card'):
            try:
                title_elem = job_card.find('h3', class_='base-search-card__title')
                company_elem = job_card.find('h4', class_='base-search-card__subtitle')
                location_elem = job_card.find('span', class_='job-search-card__location')
                link_elem = job_card.find('a', class_='base-card__full-link')
                
                if all([title_elem, company_elem, location_elem, link_elem]):
                    jobs.append({
                        'title': title_elem.text.strip(),
                        'company': company_elem.text.strip(),
                        'location': location_elem.text.strip(),
                        'link': link_elem['href']
                    })
            except Exception as e:
                logger.warning(f"Error parsing job card: {str(e)}")
                continue
        
        return jsonify({'jobs': jobs})
    except requests.RequestException as e:
        logger.error(f"Request error in search_jobs: {str(e)}")
        return jsonify({'error': 'Failed to fetch jobs from LinkedIn'}), 503
    except Exception as e:
        logger.error(f"Error in search_jobs: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Check if API key is configured
    if not os.getenv("GOOGLE_API_KEY"):
        logger.error("GOOGLE_API_KEY not found in environment variables")
        raise ValueError("GOOGLE_API_KEY is required")
    
    port = int(os.getenv('PORT', 8080))
    app.run(debug=True, port=port)