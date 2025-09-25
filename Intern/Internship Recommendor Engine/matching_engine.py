"""
Smart India Hackathon - AI Internship Matching Engine
Step 1: Core Matching Engine with Profile Data

This module implements the core matching algorithm that:
1. Takes structured profile data and internship data
2. Computes fit scores based on various factors
3. Ranks internships by compatibility
4. Returns top N recommendations
"""

import json
import math
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass
from collections import Counter


@dataclass
class CandidateProfile:
    """Structured candidate profile data"""
    full_name: str
    education: str
    contact_number: str
    current_address: str
    email: str
    linkedin: str
    experience: List[str]  # List of experience entries
    skills: List[str]      # List of skills
    gender: str
    disability_status: bool
    veteran: bool
    preferred_sectors: List[str] = None
    preferred_location: str = None
    preferred_duration: str = None
    preferred_company_type: str = None


@dataclass
class Internship:
    """Structured internship data"""
    title: str
    skills_required: List[str]
    sector: str
    location: str
    duration: str
    company_type: str
    link: str
    capacity: int
    remote_available: bool = False


class MatchingEngine:
    """
    Core matching engine that computes fit scores between candidates and internships
    """
    
    def __init__(self):
        # Weight configuration for different matching factors
        self.weights = {
            'skills': 0.35,      # 35% - Most important factor
            'sector': 0.20,      # 20% - Industry alignment
            'location': 0.15,    # 15% - Geographic preference
            'duration': 0.10,    # 10% - Time commitment
            'company_type': 0.10, # 10% - Company preference
            'affirmative_action': 0.05, # 5% - Diversity factors
            'capacity': 0.05     # 5% - Availability
        }
    
    def normalize_skills(self, skills: List[str]) -> List[str]:
        """Normalize skill names for better matching"""
        skill_mapping = {
            'python': ['python', 'py', 'python3'],
            'javascript': ['javascript', 'js', 'node.js', 'nodejs'],
            'java': ['java', 'java8', 'java11'],
            'machine learning': ['ml', 'machine learning', 'ai', 'artificial intelligence'],
            'data science': ['data science', 'data analysis', 'analytics'],
            'web development': ['web dev', 'web development', 'frontend', 'backend'],
            'react': ['react', 'reactjs', 'react.js'],
            'sql': ['sql', 'database', 'mysql', 'postgresql'],
            'git': ['git', 'github', 'version control'],
            'communication': ['communication', 'verbal', 'written communication']
        }
        
        normalized = []
        for skill in skills:
            skill_lower = skill.lower().strip()
            found = False
            for standard, variants in skill_mapping.items():
                if skill_lower in variants or skill_lower == standard:
                    normalized.append(standard)
                    found = True
                    break
            if not found:
                normalized.append(skill_lower)
        
        return list(set(normalized))  # Remove duplicates
    
    def compute_skill_match(self, candidate_skills: List[str], required_skills: List[str]) -> float:
        """Compute skill overlap score between candidate and internship"""
        if not required_skills:
            return 1.0  # No requirements = perfect match
        
        candidate_normalized = self.normalize_skills(candidate_skills)
        required_normalized = self.normalize_skills(required_skills)
        
        # Calculate Jaccard similarity
        candidate_set = set(candidate_normalized)
        required_set = set(required_normalized)
        
        intersection = len(candidate_set.intersection(required_set))
        union = len(candidate_set.union(required_set))
        
        if union == 0:
            return 0.0
        
        return intersection / union
    
    def compute_sector_match(self, candidate_sectors: List[str], internship_sector: str) -> float:
        """Compute sector alignment score"""
        if not candidate_sectors or not internship_sector:
            return 0.5  # Neutral score if no preference/requirement
        
        internship_sector_lower = internship_sector.lower().strip()
        
        for sector in candidate_sectors:
            if sector.lower().strip() == internship_sector_lower:
                return 1.0
        
        # Partial matches for related sectors
        sector_relations = {
            'technology': ['it', 'software', 'tech', 'computer science'],
            'finance': ['banking', 'fintech', 'investment'],
            'healthcare': ['medical', 'pharma', 'biotech'],
            'education': ['edtech', 'training', 'learning'],
            'marketing': ['advertising', 'digital marketing', 'branding']
        }
        
        for preferred_sector in candidate_sectors:
            preferred_lower = preferred_sector.lower().strip()
            if preferred_lower in sector_relations:
                if internship_sector_lower in sector_relations[preferred_lower]:
                    return 0.7
        
        return 0.0
    
    def compute_location_match(self, candidate_location: str, internship_location: str, remote_available: bool) -> float:
        """Compute location compatibility score"""
        if not candidate_location or not internship_location:
            return 0.5
        
        candidate_lower = candidate_location.lower().strip()
        internship_lower = internship_location.lower().strip()
        
        # Exact match
        if candidate_lower == internship_lower:
            return 1.0
        
        # Remote work preference
        if remote_available and ('remote' in candidate_lower or 'work from home' in candidate_lower):
            return 0.9
        
        # City-level matching (simplified)
        if any(city in internship_lower for city in candidate_lower.split(',')):
            return 0.8
        
        # State-level matching (simplified)
        if any(state in internship_lower for state in candidate_lower.split(',')):
            return 0.6
        
        return 0.2  # Different location
    
    def compute_duration_match(self, candidate_duration: str, internship_duration: str) -> float:
        """Compute duration compatibility score"""
        if not candidate_duration or not internship_duration:
            return 0.5
        
        # Extract numeric values from duration strings
        def extract_months(duration_str):
            duration_lower = duration_str.lower()
            if 'month' in duration_lower:
                try:
                    return int(''.join(filter(str.isdigit, duration_lower)))
                except:
                    return 0
            return 0
        
        candidate_months = extract_months(candidate_duration)
        internship_months = extract_months(internship_duration)
        
        if candidate_months == 0 or internship_months == 0:
            return 0.5
        
        # Flexible matching: within 25% difference is good
        ratio = min(candidate_months, internship_months) / max(candidate_months, internship_months)
        return ratio if ratio >= 0.75 else ratio * 0.5
    
    def compute_company_type_match(self, candidate_company_type: str, internship_company_type: str) -> float:
        """Compute company type compatibility score"""
        if not candidate_company_type or not internship_company_type:
            return 0.5
        
        candidate_lower = candidate_company_type.lower().strip()
        internship_lower = internship_company_type.lower().strip()
        
        if candidate_lower == internship_lower:
            return 1.0
        
        # Related company types
        company_relations = {
            'startup': ['small company', 'emerging company'],
            'mnc': ['multinational', 'large company', 'corporate'],
            'ngo': ['non-profit', 'social enterprise'],
            'government': ['public sector', 'govt']
        }
        
        for preferred_type, related_types in company_relations.items():
            if candidate_lower == preferred_type and internship_lower in related_types:
                return 0.7
            if internship_lower == preferred_type and candidate_lower in related_types:
                return 0.7
        
        return 0.3
    
    def compute_affirmative_action_score(self, profile: CandidateProfile) -> float:
        """Compute affirmative action bonus score"""
        score = 0.0
        
        if profile.disability_status:
            score += 0.1
        
        if profile.veteran:
            score += 0.1
        
        # Gender diversity (simplified)
        if profile.gender.lower() in ['female', 'transgender', 'non-binary']:
            score += 0.05
        
        return min(score, 0.2)  # Cap at 20% bonus
    
    def compute_capacity_score(self, capacity: int) -> float:
        """Compute score based on internship capacity"""
        if capacity <= 0:
            return 0.0
        elif capacity >= 10:
            return 1.0
        else:
            return capacity / 10.0
    
    def compute_fit_score(self, profile: CandidateProfile, internship: Internship) -> float:
        """
        Compute overall fit score between candidate and internship
        Returns a score between 0.0 and 1.0
        """
        # Compute individual component scores
        skill_score = self.compute_skill_match(profile.skills, internship.skills_required)
        sector_score = self.compute_sector_match(profile.preferred_sectors or [], internship.sector)
        location_score = self.compute_location_match(
            profile.preferred_location, 
            internship.location, 
            internship.remote_available
        )
        duration_score = self.compute_duration_match(profile.preferred_duration, internship.duration)
        company_score = self.compute_company_type_match(profile.preferred_company_type, internship.company_type)
        affirmative_score = self.compute_affirmative_action_score(profile)
        capacity_score = self.compute_capacity_score(internship.capacity)
        
        # Weighted combination
        weighted_score = (
            self.weights['skills'] * skill_score +
            self.weights['sector'] * sector_score +
            self.weights['location'] * location_score +
            self.weights['duration'] * duration_score +
            self.weights['company_type'] * company_score +
            self.weights['affirmative_action'] * affirmative_score +
            self.weights['capacity'] * capacity_score
        )
        
        return min(weighted_score, 1.0)  # Ensure score doesn't exceed 1.0
    
    def rank_internships(self, profile: CandidateProfile, internships: List[Internship], top_n: int = 10) -> List[Tuple[Internship, float, Dict[str, float]]]:
        """
        Rank internships by fit score and return top N matches
        
        Returns:
            List of tuples: (internship, total_score, component_scores)
        """
        scored_internships = []
        
        for internship in internships:
            total_score = self.compute_fit_score(profile, internship)
            
            # Get component scores for explanation
            component_scores = {
                'skills': self.compute_skill_match(profile.skills, internship.skills_required),
                'sector': self.compute_sector_match(profile.preferred_sectors or [], internship.sector),
                'location': self.compute_location_match(profile.preferred_location, internship.location, internship.remote_available),
                'duration': self.compute_duration_match(profile.preferred_duration, internship.duration),
                'company_type': self.compute_company_type_match(profile.preferred_company_type, internship.company_type),
                'affirmative_action': self.compute_affirmative_action_score(profile),
                'capacity': self.compute_capacity_score(internship.capacity)
            }
            
            scored_internships.append((internship, total_score, component_scores))
        
        # Sort by total score (descending)
        scored_internships.sort(key=lambda x: x[1], reverse=True)
        
        return scored_internships[:top_n]


def create_sample_data():
    """Create sample data for testing the matching engine"""
    
    # Sample candidate profile
    sample_profile = CandidateProfile(
        full_name="Priya Sharma",
        education="B.Tech Computer Science",
        contact_number="+91-9876543210",
        current_address="Bangalore, Karnataka",
        email="priya.sharma@email.com",
        linkedin="linkedin.com/in/priyasharma",
        experience=["6 months internship at TechCorp", "Freelance web development projects"],
        skills=["Python", "JavaScript", "React", "SQL", "Machine Learning", "Git"],
        gender="Female",
        disability_status=False,
        veteran=False,
        preferred_sectors=["Technology", "Fintech"],
        preferred_location="Bangalore",
        preferred_duration="6 months",
        preferred_company_type="Startup"
    )
    
    # Sample internships
    sample_internships = [
        Internship(
            title="Python Developer Intern",
            skills_required=["Python", "Django", "SQL", "Git"],
            sector="Technology",
            location="Bangalore",
            duration="6 months",
            company_type="Startup",
            link="https://example.com/internship1",
            capacity=5,
            remote_available=True
        ),
        Internship(
            title="Frontend Developer Intern",
            skills_required=["JavaScript", "React", "HTML", "CSS"],
            sector="Technology",
            location="Mumbai",
            duration="3 months",
            company_type="MNC",
            link="https://example.com/internship2",
            capacity=8,
            remote_available=False
        ),
        Internship(
            title="Data Science Intern",
            skills_required=["Python", "Machine Learning", "SQL", "Statistics"],
            sector="Fintech",
            location="Bangalore",
            duration="6 months",
            company_type="Startup",
            link="https://example.com/internship3",
            capacity=3,
            remote_available=True
        ),
        Internship(
            title="Full Stack Developer Intern",
            skills_required=["Python", "JavaScript", "React", "Node.js", "MongoDB"],
            sector="Technology",
            location="Delhi",
            duration="4 months",
            company_type="Startup",
            link="https://example.com/internship4",
            capacity=6,
            remote_available=True
        ),
        Internship(
            title="AI/ML Research Intern",
            skills_required=["Python", "Machine Learning", "TensorFlow", "Research"],
            sector="Technology",
            location="Bangalore",
            duration="8 months",
            company_type="MNC",
            link="https://example.com/internship5",
            capacity=2,
            remote_available=False
        )
    ]
    
    return sample_profile, sample_internships


def main():
    """Main function to demonstrate the matching engine"""
    print("=== Smart India Hackathon - AI Internship Matching Engine ===\n")
    
    # Create sample data
    profile, internships = create_sample_data()
    
    # Initialize matching engine
    engine = MatchingEngine()
    
    # Get top 5 matches
    top_matches = engine.rank_internships(profile, internships, top_n=5)
    
    print(f"Profile: {profile.full_name}")
    print(f"Skills: {', '.join(profile.skills)}")
    print(f"Preferred Sectors: {', '.join(profile.preferred_sectors or [])}")
    print(f"Preferred Location: {profile.preferred_location}")
    print(f"Preferred Duration: {profile.preferred_duration}")
    print(f"Preferred Company Type: {profile.preferred_company_type}")
    print(f"Gender: {profile.gender}")
    print(f"Disability Status: {profile.disability_status}")
    print(f"Veteran: {profile.veteran}\n")
    
    print("=== TOP 5 INTERNSHIP MATCHES ===\n")
    
    for i, (internship, total_score, component_scores) in enumerate(top_matches, 1):
        print(f"{i}. {internship.title}")
        print(f"   Company: {internship.company_type} | Sector: {internship.sector}")
        print(f"   Location: {internship.location} | Duration: {internship.duration}")
        print(f"   Remote Available: {internship.remote_available} | Capacity: {internship.capacity}")
        print(f"   Required Skills: {', '.join(internship.skills_required)}")
        print(f"   Link: {internship.link}")
        print(f"   Overall Fit Score: {total_score:.3f}")
        print(f"   Component Scores:")
        for component, score in component_scores.items():
            print(f"     - {component.replace('_', ' ').title()}: {score:.3f}")
        print()


if __name__ == "__main__":
    main()
