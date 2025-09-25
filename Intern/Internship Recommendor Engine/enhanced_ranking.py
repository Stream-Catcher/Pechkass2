"""
Smart India Hackathon - Enhanced Ranking Algorithm
Step 3: Advanced scoring factors and ranking improvements

This module adds:
1. Past participation tracking
2. Capacity optimization
3. Diversity scoring
4. Time-based preferences
5. Advanced skill matching
6. Company reputation scoring
"""

import json
import math
from typing import Dict, List, Any, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
from matching_engine import CandidateProfile, Internship, MatchingEngine
from llm_preference_processor import EnhancedMatchingEngine


@dataclass
class PastParticipation:
    """Track past internship participation"""
    candidate_id: str
    internship_id: str
    company_name: str
    sector: str
    completion_status: str  # "completed", "dropped", "ongoing"
    rating: float  # 1.0 to 5.0
    feedback: str


@dataclass
class CompanyReputation:
    """Company reputation and metrics"""
    company_name: str
    reputation_score: float  # 0.0 to 1.0
    employee_satisfaction: float  # 0.0 to 1.0
    growth_rate: float  # 0.0 to 1.0
    diversity_score: float  # 0.0 to 1.0
    work_life_balance: float  # 0.0 to 1.0


class EnhancedRankingEngine(EnhancedMatchingEngine):
    """
    Enhanced matching engine with advanced ranking features
    """
    
    def __init__(self, use_llm: bool = True, api_key: str = None):
        super().__init__(use_llm, api_key)
        
        # Enhanced weights for advanced scoring
        self.enhanced_weights = {
            'skills': 0.25,           # Reduced from 0.35
            'sector': 0.15,           # Reduced from 0.20
            'location': 0.10,         # Reduced from 0.15
            'duration': 0.08,         # Reduced from 0.10
            'company_type': 0.08,     # Reduced from 0.10
            'affirmative_action': 0.05, # Same
            'capacity': 0.05,         # Same
            'past_participation': 0.10,  # NEW
            'company_reputation': 0.08,  # NEW
            'diversity_bonus': 0.06,     # NEW
            'time_preference': 0.05,     # NEW
            'skill_advanced_match': 0.05 # NEW
        }
        
        # Sample data for demonstration
        self.past_participations = self._create_sample_past_participations()
        self.company_reputations = self._create_sample_company_reputations()
    
    def _create_sample_past_participations(self) -> List[PastParticipation]:
        """Create sample past participation data"""
        return [
            PastParticipation(
                candidate_id="priya_sharma",
                internship_id="tech_corp_intern_2023",
                company_name="TechCorp",
                sector="Technology",
                completion_status="completed",
                rating=4.5,
                feedback="Great learning experience"
            ),
            PastParticipation(
                candidate_id="arjun_kumar",
                internship_id="startup_xyz_2023",
                company_name="StartupXYZ",
                sector="Technology",
                completion_status="completed",
                rating=3.8,
                feedback="Good exposure to startup culture"
            )
        ]
    
    def _create_sample_company_reputations(self) -> List[CompanyReputation]:
        """Create sample company reputation data"""
        return [
            CompanyReputation(
                company_name="TechCorp",
                reputation_score=0.9,
                employee_satisfaction=0.85,
                growth_rate=0.8,
                diversity_score=0.7,
                work_life_balance=0.75
            ),
            CompanyReputation(
                company_name="StartupXYZ",
                reputation_score=0.7,
                employee_satisfaction=0.9,
                growth_rate=0.95,
                diversity_score=0.8,
                work_life_balance=0.6
            ),
            CompanyReputation(
                company_name="DataCorp",
                reputation_score=0.8,
                employee_satisfaction=0.8,
                growth_rate=0.7,
                diversity_score=0.6,
                work_life_balance=0.8
            )
        ]
    
    def compute_past_participation_score(self, profile: CandidateProfile, internship: Internship) -> float:
        """Compute score based on past participation in similar internships"""
        candidate_id = profile.email.split('@')[0]  # Use email as ID
        
        # Find past participations for this candidate
        past_participations = [
            p for p in self.past_participations 
            if p.candidate_id == candidate_id
        ]
        
        if not past_participations:
            return 0.5  # Neutral score for new candidates
        
        # Check for similar sector participation
        sector_matches = [
            p for p in past_participations 
            if p.sector.lower() == internship.sector.lower()
        ]
        
        if sector_matches:
            # Calculate average rating for similar sector
            avg_rating = sum(p.rating for p in sector_matches) / len(sector_matches)
            return avg_rating / 5.0  # Normalize to 0-1
        
        # Check for same company
        company_matches = [
            p for p in past_participations 
            if p.company_name.lower() in internship.title.lower() or
               internship.title.lower() in p.company_name.lower()
        ]
        
        if company_matches:
            avg_rating = sum(p.rating for p in company_matches) / len(company_matches)
            return avg_rating / 5.0
        
        # General past experience bonus
        avg_rating = sum(p.rating for p in past_participations) / len(past_participations)
        return (avg_rating / 5.0) * 0.7  # Reduced bonus for different sectors
    
    def compute_company_reputation_score(self, internship: Internship) -> float:
        """Compute score based on company reputation"""
        # Try to match company name from internship title
        company_name = self._extract_company_name(internship.title)
        
        for reputation in self.company_reputations:
            if company_name.lower() in reputation.company_name.lower():
                # Weighted combination of reputation factors
                return (
                    reputation.reputation_score * 0.3 +
                    reputation.employee_satisfaction * 0.25 +
                    reputation.growth_rate * 0.2 +
                    reputation.diversity_score * 0.15 +
                    reputation.work_life_balance * 0.1
                )
        
        # Default score for unknown companies
        return 0.6
    
    def _extract_company_name(self, title: str) -> str:
        """Extract company name from internship title"""
        # Simple extraction - in real implementation, this would be more sophisticated
        if "Developer" in title:
            return "TechCorp"
        elif "Data Science" in title:
            return "DataCorp"
        elif "Frontend" in title:
            return "WebCorp"
        elif "AI/ML" in title:
            return "AICorp"
        else:
            return "UnknownCorp"
    
    def compute_diversity_bonus(self, profile: CandidateProfile, internship: Internship) -> float:
        """Compute diversity bonus score"""
        bonus = 0.0
        
        # Gender diversity
        if profile.gender.lower() in ['female', 'transgender', 'non-binary']:
            bonus += 0.1
        
        # Disability inclusion
        if profile.disability_status:
            bonus += 0.15
        
        # Veteran preference
        if profile.veteran:
            bonus += 0.1
        
        # Location diversity (encouraging candidates from different regions)
        if profile.current_address and internship.location:
            if not any(city in profile.current_address for city in internship.location.split(',')):
                bonus += 0.05  # Bonus for geographic diversity
        
        return min(bonus, 0.3)  # Cap at 30% bonus
    
    def compute_time_preference_score(self, profile: CandidateProfile, internship: Internship) -> float:
        """Compute score based on time-based preferences"""
        # This could be enhanced with actual time data
        current_time = datetime.now()
        
        # Prefer internships starting soon (within next 2 months)
        # This is a simplified implementation
        return 0.8  # Default good score
    
    def compute_advanced_skill_match(self, profile: CandidateProfile, internship: Internship) -> float:
        """Compute advanced skill matching with skill levels and combinations"""
        if not internship.skills_required:
            return 1.0
        
        candidate_skills = set(self.normalize_skills(profile.skills))
        required_skills = set(self.normalize_skills(internship.skills_required))
        
        # Basic overlap
        overlap = len(candidate_skills.intersection(required_skills))
        total_required = len(required_skills)
        
        if total_required == 0:
            return 1.0
        
        base_score = overlap / total_required
        
        # Bonus for having all required skills
        if overlap == total_required:
            base_score += 0.2
        
        # Bonus for having additional relevant skills
        additional_skills = candidate_skills - required_skills
        if additional_skills:
            base_score += min(len(additional_skills) * 0.05, 0.15)
        
        return min(base_score, 1.0)
    
    def compute_enhanced_fit_score(self, profile: CandidateProfile, internship: Internship) -> float:
        """
        Compute enhanced fit score with all advanced factors
        """
        # Get base scores from parent class
        base_scores = {
            'skills': self.compute_skill_match(profile.skills, internship.skills_required),
            'sector': self.compute_sector_match(profile.preferred_sectors or [], internship.sector),
            'location': self.compute_location_match(profile.preferred_location, internship.location, internship.remote_available),
            'duration': self.compute_duration_match(profile.preferred_duration, internship.duration),
            'company_type': self.compute_company_type_match(profile.preferred_company_type, internship.company_type),
            'affirmative_action': self.compute_affirmative_action_score(profile),
            'capacity': self.compute_capacity_score(internship.capacity)
        }
        
        # Compute enhanced scores
        enhanced_scores = {
            'past_participation': self.compute_past_participation_score(profile, internship),
            'company_reputation': self.compute_company_reputation_score(internship),
            'diversity_bonus': self.compute_diversity_bonus(profile, internship),
            'time_preference': self.compute_time_preference_score(profile, internship),
            'skill_advanced_match': self.compute_advanced_skill_match(profile, internship)
        }
        
        # Combine all scores with enhanced weights
        total_score = 0.0
        for factor, weight in self.enhanced_weights.items():
            if factor in base_scores:
                total_score += weight * base_scores[factor]
            elif factor in enhanced_scores:
                total_score += weight * enhanced_scores[factor]
        
        return min(total_score, 1.0)
    
    def rank_internships_enhanced(self, profile: CandidateProfile, internships: List[Internship], top_n: int = 10) -> List[Tuple[Internship, float, Dict[str, float]]]:
        """
        Enhanced ranking with all advanced factors
        """
        scored_internships = []
        
        for internship in internships:
            total_score = self.compute_enhanced_fit_score(profile, internship)
            
            # Get all component scores for detailed explanation
            component_scores = {
                'skills': self.compute_skill_match(profile.skills, internship.skills_required),
                'sector': self.compute_sector_match(profile.preferred_sectors or [], internship.sector),
                'location': self.compute_location_match(profile.preferred_location, internship.location, internship.remote_available),
                'duration': self.compute_duration_match(profile.preferred_duration, internship.duration),
                'company_type': self.compute_company_type_match(profile.preferred_company_type, internship.company_type),
                'affirmative_action': self.compute_affirmative_action_score(profile),
                'capacity': self.compute_capacity_score(internship.capacity),
                'past_participation': self.compute_past_participation_score(profile, internship),
                'company_reputation': self.compute_company_reputation_score(internship),
                'diversity_bonus': self.compute_diversity_bonus(profile, internship),
                'time_preference': self.compute_time_preference_score(profile, internship),
                'skill_advanced_match': self.compute_advanced_skill_match(profile, internship)
            }
            
            scored_internships.append((internship, total_score, component_scores))
        
        # Sort by total score (descending)
        scored_internships.sort(key=lambda x: x[1], reverse=True)
        
        return scored_internships[:top_n]
    
    def match_with_enhanced_ranking(self, profile: CandidateProfile, natural_language_preferences: str, internships: List[Internship], top_n: int = 10) -> Tuple[List[Tuple[Internship, float, Dict[str, float]]], Any]:
        """
        Enhanced matching with natural language processing and advanced ranking
        """
        # Process natural language preferences
        extracted_preferences = self.preference_processor.process_natural_language_preferences(natural_language_preferences)
        
        # Merge with existing profile
        enhanced_profile = self.preference_processor.merge_with_profile(profile, extracted_preferences)
        
        # Rank internships using enhanced algorithm
        ranked_internships = self.rank_internships_enhanced(enhanced_profile, internships, top_n)
        
        return ranked_internships, extracted_preferences


def main():
    """Demonstrate enhanced ranking system"""
    print("🚀 === ENHANCED RANKING SYSTEM DEMO === 🚀\n")
    
    # Get sample data
    from matching_engine import create_sample_data
    profile, internships = create_sample_data()
    
    # Initialize enhanced engine
    gemini_key = "AIzaSyCb4zh0ePCQX8IbN8h-e7mM8OiIpBKrA-c"
    engine = EnhancedRankingEngine(use_llm=True, api_key=gemini_key)
    
    # Test with natural language input
    natural_input = "I'm looking for a 6-month internship in a tech startup in Bangalore. I prefer working with Python and machine learning. Remote work would be great!"
    
    print(f"📝 Input: {natural_input}\n")
    
    # Get enhanced matches
    matches, extracted_prefs = engine.match_with_enhanced_ranking(
        profile, natural_input, internships, top_n=3
    )
    
    print("🎯 Enhanced Ranking Results:")
    print("=" * 60)
    
    for i, (internship, score, components) in enumerate(matches, 1):
        print(f"\n{i}. {internship.title} (Enhanced Score: {score:.3f})")
        print(f"   Company: {internship.company_type} | Sector: {internship.sector}")
        print(f"   Location: {internship.location} | Duration: {internship.duration}")
        
        print(f"\n   📊 Component Scores:")
        print(f"      Skills: {components['skills']:.3f} | Sector: {components['sector']:.3f}")
        print(f"      Location: {components['location']:.3f} | Duration: {components['duration']:.3f}")
        print(f"      Company Type: {components['company_type']:.3f} | Capacity: {components['capacity']:.3f}")
        print(f"      Past Participation: {components['past_participation']:.3f}")
        print(f"      Company Reputation: {components['company_reputation']:.3f}")
        print(f"      Diversity Bonus: {components['diversity_bonus']:.3f}")
        print(f"      Advanced Skills: {components['skill_advanced_match']:.3f}")
    
    print(f"\n✅ Enhanced ranking system is working!")
    print(f"🎯 Key improvements:")
    print(f"   - Past participation tracking")
    print(f"   - Company reputation scoring")
    print(f"   - Enhanced diversity bonuses")
    print(f"   - Advanced skill matching")
    print(f"   - Time-based preferences")


if __name__ == "__main__":
    main()
