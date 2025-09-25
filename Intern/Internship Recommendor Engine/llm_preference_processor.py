"""
Smart India Hackathon - AI Internship Matching Engine
Step 2: LLM Integration for Natural Language Preference Processing

This module handles:
1. Processing free-form natural language preferences
2. Extracting structured information from text
3. Integrating with the existing matching engine
4. Fallback to rule-based processing when LLM is unavailable
"""

import json
import re
import requests
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from matching_engine import CandidateProfile, MatchingEngine, Internship


@dataclass
class ExtractedPreferences:
    """Structured preferences extracted from natural language"""
    preferred_sectors: List[str] = None
    preferred_location: str = None
    preferred_duration: str = None
    preferred_company_type: str = None
    additional_skills: List[str] = None
    work_style_preferences: List[str] = None
    salary_expectations: str = None
    remote_preference: bool = None
    confidence_score: float = 0.0


class LLMPreferenceProcessor:
    """
    Processes natural language preferences using LLM and rule-based fallbacks
    """
    
    def __init__(self, use_llm: bool = True, api_key: str = None):
        self.use_llm = use_llm
        self.api_key = api_key
        
        # Rule-based patterns for fallback processing
        self.patterns = {
            'sectors': {
                'technology': ['tech', 'software', 'it', 'computer', 'programming', 'coding', 'development'],
                'finance': ['finance', 'banking', 'fintech', 'investment', 'financial'],
                'healthcare': ['healthcare', 'medical', 'pharma', 'biotech', 'health'],
                'education': ['education', 'edtech', 'learning', 'training', 'teaching'],
                'marketing': ['marketing', 'advertising', 'branding', 'digital marketing'],
                'consulting': ['consulting', 'strategy', 'business'],
                'government': ['government', 'public sector', 'govt', 'ministry'],
                'ngo': ['ngo', 'non-profit', 'social', 'charity', 'volunteer']
            },
            'locations': {
                'bangalore': ['bangalore', 'bengaluru', 'blore'],
                'mumbai': ['mumbai', 'bombay'],
                'delhi': ['delhi', 'new delhi', 'ncr', 'gurgaon', 'gurugram', 'noida'],
                'hyderabad': ['hyderabad', 'cyberabad'],
                'chennai': ['chennai', 'madras'],
                'pune': ['pune'],
                'kolkata': ['kolkata', 'calcutta'],
                'remote': ['remote', 'work from home', 'wfh', 'online', 'virtual']
            },
            'durations': {
                '1 month': ['1 month', 'one month', '1m'],
                '2 months': ['2 months', 'two months', '2m'],
                '3 months': ['3 months', 'three months', '3m', 'quarter'],
                '6 months': ['6 months', 'six months', '6m', 'half year'],
                '1 year': ['1 year', 'one year', '1y', '12 months']
            },
            'company_types': {
                'startup': ['startup', 'start-up', 'emerging', 'small company'],
                'mnc': ['mnc', 'multinational', 'large company', 'corporate', 'fortune 500'],
                'government': ['government', 'public sector', 'govt'],
                'ngo': ['ngo', 'non-profit', 'social enterprise']
            },
            'skills': {
                'python': ['python', 'py', 'python3'],
                'javascript': ['javascript', 'js', 'node.js', 'nodejs'],
                'java': ['java', 'java8', 'java11'],
                'react': ['react', 'reactjs', 'react.js'],
                'machine learning': ['ml', 'machine learning', 'ai', 'artificial intelligence'],
                'data science': ['data science', 'data analysis', 'analytics'],
                'sql': ['sql', 'database', 'mysql', 'postgresql'],
                'git': ['git', 'github', 'version control'],
                'communication': ['communication', 'verbal', 'written communication'],
                'leadership': ['leadership', 'team management', 'project management']
            }
        }
    
    def process_natural_language_preferences(self, text: str) -> ExtractedPreferences:
        """
        Process natural language text to extract structured preferences
        
        Args:
            text: Free-form text describing user preferences
            
        Returns:
            ExtractedPreferences object with structured data
        """
        if not text or not text.strip():
            return ExtractedPreferences()
        
        text_lower = text.lower().strip()
        
        if self.use_llm and self.api_key:
            try:
                return self._process_with_llm(text)
            except Exception as e:
                print(f"LLM processing failed, falling back to rule-based: {e}")
                return self._process_with_rules(text_lower)
        else:
            return self._process_with_rules(text_lower)
    
    def _process_with_llm(self, text: str) -> ExtractedPreferences:
        """
        Process preferences using real LLM (Gemini API)
        """
        if not self.api_key:
            print("⚠️  No API key provided, using fallback rule-based processing")
            return self._process_with_rules(text.lower())
        
        try:
            return self._process_with_gemini(text)
        except Exception as e:
            print(f"⚠️  LLM API failed: {e}")
            print("🔄 Falling back to rule-based processing...")
            return self._process_with_rules(text.lower())
    
    def _process_with_gemini(self, text: str) -> ExtractedPreferences:
        """Process using Google Gemini API"""
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        
        prompt = f"""
        Extract internship preferences from this text: "{text}"
        
        Return ONLY a JSON object with these exact fields:
        {{
            "preferred_sectors": ["list", "of", "sectors"],
            "preferred_location": "city name or null",
            "preferred_duration": "duration string or null", 
            "preferred_company_type": "company type or null",
            "additional_skills": ["list", "of", "skills"],
            "work_style_preferences": ["remote", "office", "hybrid"],
            "salary_expectations": "salary string or null",
            "remote_preference": true/false,
            "confidence_score": 0.0-1.0
        }}
        
        Valid sectors: Technology, Finance, Healthcare, Education, Marketing, Consulting, Government, NGO
        Valid company types: Startup, MNC, Government, NGO
        Valid durations: 1 month, 2 months, 3 months, 6 months, 1 year
        """
        
        data = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 500
            }
        }
        
        response = requests.post(url, json=data, timeout=10)
        response.raise_for_status()
        
        result = response.json()
        content = result['candidates'][0]['content']['parts'][0]['text']
        
        # Clean up the response (remove markdown code blocks if present)
        if content.startswith('```json'):
            content = content.replace('```json', '').replace('```', '').strip()
        elif content.startswith('```'):
            content = content.replace('```', '').strip()
        
        # Parse JSON response
        try:
            parsed = json.loads(content)
            return self._convert_to_extracted_preferences(parsed)
        except json.JSONDecodeError:
            print("⚠️  Failed to parse Gemini response as JSON")
            return self._process_with_rules(text.lower())
    
    def _convert_to_extracted_preferences(self, data: dict) -> ExtractedPreferences:
        """Convert API response to ExtractedPreferences object"""
        return ExtractedPreferences(
            preferred_sectors=data.get('preferred_sectors'),
            preferred_location=data.get('preferred_location'),
            preferred_duration=data.get('preferred_duration'),
            preferred_company_type=data.get('preferred_company_type'),
            additional_skills=data.get('additional_skills'),
            work_style_preferences=data.get('work_style_preferences'),
            salary_expectations=data.get('salary_expectations'),
            remote_preference=data.get('remote_preference'),
            confidence_score=data.get('confidence_score', 0.0)
        )
    
    def _process_with_rules(self, text_lower: str, enhanced: bool = False) -> ExtractedPreferences:
        """
        Process preferences using rule-based pattern matching
        """
        preferences = ExtractedPreferences()
        
        # Extract sectors
        sectors = []
        for sector, keywords in self.patterns['sectors'].items():
            if any(keyword in text_lower for keyword in keywords):
                sectors.append(sector.title())
        preferences.preferred_sectors = sectors if sectors else None
        
        # Extract location
        location = None
        for loc, keywords in self.patterns['locations'].items():
            if any(keyword in text_lower for keyword in keywords):
                location = loc.title()
                break
        preferences.preferred_location = location
        
        # Extract duration
        duration = None
        for dur, keywords in self.patterns['durations'].items():
            if any(keyword in text_lower for keyword in keywords):
                duration = dur
                break
        preferences.preferred_duration = duration
        
        # Extract company type
        company_type = None
        for comp_type, keywords in self.patterns['company_types'].items():
            if any(keyword in text_lower for keyword in keywords):
                company_type = comp_type.upper()
                break
        preferences.preferred_company_type = company_type
        
        # Extract additional skills
        skills = []
        for skill, keywords in self.patterns['skills'].items():
            if any(keyword in text_lower for keyword in keywords):
                skills.append(skill.title())
        preferences.additional_skills = skills if skills else None
        
        # Extract work style preferences
        work_styles = []
        if 'remote' in text_lower or 'work from home' in text_lower or 'wfh' in text_lower:
            work_styles.append('remote')
            preferences.remote_preference = True
        if 'office' in text_lower or 'onsite' in text_lower:
            work_styles.append('office')
        if 'hybrid' in text_lower:
            work_styles.append('hybrid')
        preferences.work_style_preferences = work_styles if work_styles else None
        
        # Extract salary expectations
        salary_patterns = [
            r'(\d+)\s*(?:lakh|lac|k|thousand)',
            r'rs\.?\s*(\d+)',
            r'₹\s*(\d+)',
            r'(\d+)\s*rupees'
        ]
        for pattern in salary_patterns:
            match = re.search(pattern, text_lower)
            if match:
                preferences.salary_expectations = match.group(0)
                break
        
        # Calculate confidence score
        confidence = self._calculate_confidence(preferences, text_lower)
        preferences.confidence_score = confidence
        
        return preferences
    
    def _calculate_confidence(self, preferences: ExtractedPreferences, text_lower: str) -> float:
        """Calculate confidence score based on extracted information"""
        score = 0.0
        total_checks = 0
        
        # Check if we found meaningful information
        if preferences.preferred_sectors:
            score += 0.2
        total_checks += 1
        
        if preferences.preferred_location:
            score += 0.2
        total_checks += 1
        
        if preferences.preferred_duration:
            score += 0.2
        total_checks += 1
        
        if preferences.preferred_company_type:
            score += 0.2
        total_checks += 1
        
        if preferences.additional_skills:
            score += 0.1
        total_checks += 1
        
        if preferences.work_style_preferences:
            score += 0.1
        total_checks += 1
        
        # Bonus for specific keywords that indicate clear intent
        intent_keywords = ['want', 'prefer', 'looking for', 'interested in', 'would like']
        if any(keyword in text_lower for keyword in intent_keywords):
            score += 0.1
        
        return min(score, 1.0)
    
    def merge_with_profile(self, profile: CandidateProfile, preferences: ExtractedPreferences) -> CandidateProfile:
        """
        Merge extracted preferences with existing profile data
        """
        # Create a copy of the profile to avoid modifying the original
        merged_profile = CandidateProfile(
            full_name=profile.full_name,
            education=profile.education,
            contact_number=profile.contact_number,
            current_address=profile.current_address,
            email=profile.email,
            linkedin=profile.linkedin,
            experience=profile.experience.copy(),
            skills=profile.skills.copy(),
            gender=profile.gender,
            disability_status=profile.disability_status,
            veteran=profile.veteran,
            preferred_sectors=profile.preferred_sectors.copy() if profile.preferred_sectors else [],
            preferred_location=profile.preferred_location,
            preferred_duration=profile.preferred_duration,
            preferred_company_type=profile.preferred_company_type
        )
        
        # Merge sectors
        if preferences.preferred_sectors:
            if merged_profile.preferred_sectors:
                # Combine and deduplicate
                all_sectors = list(set(merged_profile.preferred_sectors + preferences.preferred_sectors))
                merged_profile.preferred_sectors = all_sectors
            else:
                merged_profile.preferred_sectors = preferences.preferred_sectors
        
        # Override location if specified in preferences
        if preferences.preferred_location:
            merged_profile.preferred_location = preferences.preferred_location
        
        # Override duration if specified in preferences
        if preferences.preferred_duration:
            merged_profile.preferred_duration = preferences.preferred_duration
        
        # Override company type if specified in preferences
        if preferences.preferred_company_type:
            merged_profile.preferred_company_type = preferences.preferred_company_type
        
        # Add additional skills
        if preferences.additional_skills:
            all_skills = list(set(merged_profile.skills + preferences.additional_skills))
            merged_profile.skills = all_skills
        
        return merged_profile


class EnhancedMatchingEngine(MatchingEngine):
    """
    Enhanced matching engine that integrates with LLM preference processing
    """
    
    def __init__(self, use_llm: bool = True, api_key: str = None):
        super().__init__()
        self.preference_processor = LLMPreferenceProcessor(use_llm, api_key)
    
    def match_with_natural_language(self, 
                                  profile: CandidateProfile, 
                                  natural_language_preferences: str,
                                  internships: List[Internship], 
                                  top_n: int = 10) -> Tuple[List[Tuple[Internship, float, Dict[str, float]]], ExtractedPreferences]:
        """
        Match internships using both profile data and natural language preferences
        
        Returns:
            Tuple of (ranked_internships, extracted_preferences)
        """
        # Process natural language preferences
        extracted_preferences = self.preference_processor.process_natural_language_preferences(
            natural_language_preferences
        )
        
        # Merge with existing profile
        enhanced_profile = self.preference_processor.merge_with_profile(profile, extracted_preferences)
        
        # Rank internships using enhanced profile
        ranked_internships = self.rank_internships(enhanced_profile, internships, top_n)
        
        return ranked_internships, extracted_preferences
    
    def explain_preference_processing(self, natural_language_preferences: str) -> str:
        """
        Provide explanation of how natural language preferences were processed
        """
        extracted = self.preference_processor.process_natural_language_preferences(
            natural_language_preferences
        )
        
        explanation = "Natural Language Processing Results:\n"
        explanation += f"Confidence Score: {extracted.confidence_score:.2f}\n\n"
        
        if extracted.preferred_sectors:
            explanation += f"Detected Sectors: {', '.join(extracted.preferred_sectors)}\n"
        
        if extracted.preferred_location:
            explanation += f"Detected Location: {extracted.preferred_location}\n"
        
        if extracted.preferred_duration:
            explanation += f"Detected Duration: {extracted.preferred_duration}\n"
        
        if extracted.preferred_company_type:
            explanation += f"Detected Company Type: {extracted.preferred_company_type}\n"
        
        if extracted.additional_skills:
            explanation += f"Detected Skills: {', '.join(extracted.additional_skills)}\n"
        
        if extracted.work_style_preferences:
            explanation += f"Work Style: {', '.join(extracted.work_style_preferences)}\n"
        
        if extracted.remote_preference is not None:
            explanation += f"Remote Preference: {extracted.remote_preference}\n"
        
        if extracted.salary_expectations:
            explanation += f"Salary Expectations: {extracted.salary_expectations}\n"
        
        return explanation


def create_sample_natural_language_inputs():
    """Create sample natural language preference inputs for testing"""
    return [
        "I'm looking for a 6-month internship in a tech startup in Bangalore. I prefer working with Python and machine learning. Remote work would be great!",
        
        "I want to work in finance or banking sector for about 3 months. I'm interested in data analysis and have experience with SQL. Prefer Mumbai or Delhi.",
        
        "Looking for a government internship in Delhi for 1 year. I have leadership experience and good communication skills. Salary should be around 2 lakhs.",
        
        "I'm a computer science student interested in web development. I know JavaScript and React. Would like to work in an MNC for 4-6 months. Remote work preferred.",
        
        "I want to work in healthcare or education sector. I have Python skills and want to learn more about AI. Duration doesn't matter much, but prefer startup environment.",
        
        "Looking for any internship in technology field. I'm flexible with location and duration. I have basic programming skills and want to gain experience.",
        
        "I prefer working in NGOs or social enterprises. I have good communication skills and want to make a social impact. Remote work would be ideal. Duration: 6 months."
    ]


def main():
    """Main function to demonstrate LLM preference processing"""
    print("=== Smart India Hackathon - LLM Preference Processing Demo ===\n")
    
    # Initialize enhanced matching engine
    engine = EnhancedMatchingEngine(use_llm=False)  # Using rule-based for demo
    
    # Get sample data
    from matching_engine import create_sample_data
    profile, internships = create_sample_data()
    
    # Test with different natural language inputs
    sample_inputs = create_sample_natural_language_inputs()
    
    for i, natural_input in enumerate(sample_inputs[:3], 1):  # Test first 3
        print(f"--- Test Case {i} ---")
        print(f"Natural Language Input: \"{natural_input}\"")
        print()
        
        # Process preferences
        explanation = engine.explain_preference_processing(natural_input)
        print(explanation)
        
        # Get matches
        matches, extracted_prefs = engine.match_with_natural_language(
            profile, natural_input, internships, top_n=3
        )
        
        print("Top 3 Matches:")
        for j, (internship, score, components) in enumerate(matches, 1):
            print(f"  {j}. {internship.title} (Score: {score:.3f})")
            print(f"     Sector: {internship.sector} | Location: {internship.location}")
        
        print("\n" + "="*80 + "\n")


if __name__ == "__main__":
    main()
