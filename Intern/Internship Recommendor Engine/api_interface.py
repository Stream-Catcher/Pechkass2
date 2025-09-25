"""
API Interface for AI Internship Matching Engine
Provides easy-to-use interface for backend integration
"""

import json
import logging
from typing import Dict, List, Any, Optional, Tuple, Union
from dataclasses import dataclass, asdict
from datetime import datetime

from matching_engine import CandidateProfile, Internship
from llm_preference_processor import EnhancedMatchingEngine, ExtractedPreferences
from enhanced_ranking import EnhancedRankingEngine
from database_integration import DatabaseConnector


@dataclass
class MatchResult:
    """Standardized match result for API responses"""
    internship_id: str
    title: str
    company: str
    sector: str
    location: str
    duration: str
    skills_required: List[str]
    application_link: str
    overall_score: float
    component_scores: Dict[str, float]
    match_explanation: str
    remote_available: bool = False


@dataclass
class APIResponse:
    """Standardized API response format"""
    success: bool
    data: Any = None
    message: str = ""
    error_code: Optional[str] = None
    timestamp: str = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()


class AIMatchingAPI:
    """
    Main API class for the AI matching engine
    Provides simple methods that backend developers can easily integrate
    """
    
    def __init__(self, 
                 db_connector: Optional[DatabaseConnector] = None,
                 use_llm: bool = True, 
                 gemini_api_key: str = None):
        
        # Initialize components
        self.db = db_connector or DatabaseConnector()
        self.matching_engine = EnhancedRankingEngine(use_llm=use_llm, api_key=gemini_api_key)
        self.logger = logging.getLogger(__name__)
        
        # Configure logging
        logging.basicConfig(level=logging.INFO)
    
    def get_recommendations_by_user_id(self, 
                                     user_id: int, 
                                     natural_language_input: str = None,
                                     top_n: int = 10,
                                     sector_filter: str = None) -> APIResponse:
        """
        Get personalized internship recommendations for a user by ID
        
        Args:
            user_id: Database user ID
            natural_language_input: Optional free-form text preferences
            top_n: Number of recommendations to return
            sector_filter: Optional sector to filter by
            
        Returns:
            APIResponse with recommendations
        """
        try:
            # Fetch user profile
            profile = self.db.get_user_profile_by_id(user_id)
            if not profile:
                return APIResponse(
                    success=False,
                    message=f"User with ID {user_id} not found",
                    error_code="USER_NOT_FOUND"
                )
            
            return self._get_recommendations(profile, natural_language_input, top_n, sector_filter)
            
        except Exception as e:
            self.logger.error(f"Error getting recommendations for user {user_id}: {e}")
            return APIResponse(
                success=False,
                message="Internal server error",
                error_code="INTERNAL_ERROR"
            )
    
    def get_recommendations_by_email(self, 
                                   email: str, 
                                   natural_language_input: str = None,
                                   top_n: int = 10,
                                   sector_filter: str = None) -> APIResponse:
        """
        Get personalized internship recommendations for a user by email
        
        Args:
            email: User email address
            natural_language_input: Optional free-form text preferences
            top_n: Number of recommendations to return
            sector_filter: Optional sector to filter by
            
        Returns:
            APIResponse with recommendations
        """
        try:
            # Fetch user profile
            profile = self.db.get_user_profile_by_email(email)
            if not profile:
                return APIResponse(
                    success=False,
                    message=f"User with email {email} not found",
                    error_code="USER_NOT_FOUND"
                )
            
            return self._get_recommendations(profile, natural_language_input, top_n, sector_filter)
            
        except Exception as e:
            self.logger.error(f"Error getting recommendations for user {email}: {e}")
            return APIResponse(
                success=False,
                message="Internal server error",
                error_code="INTERNAL_ERROR"
            )
    
    def _get_recommendations(self, 
                           profile: CandidateProfile, 
                           natural_language_input: str,
                           top_n: int,
                           sector_filter: str) -> APIResponse:
        """Internal method to generate recommendations"""
        try:
            # Fetch internships
            if sector_filter:
                internships = self.db.get_internships_by_sector(sector_filter)
            else:
                internships = self.db.get_active_internships()
            
            if not internships:
                return APIResponse(
                    success=True,
                    data=[],
                    message="No active internships found"
                )
            
            # Get matches
            if natural_language_input:
                matches, extracted_prefs = self.matching_engine.match_with_enhanced_ranking(
                    profile, natural_language_input, internships, top_n
                )
                
                # Include extracted preferences in response
                extracted_prefs_dict = asdict(extracted_prefs)
            else:
                matches = self.matching_engine.rank_internships_enhanced(profile, internships, top_n)
                extracted_prefs_dict = None
            
            # Convert to API format
            match_results = []
            for i, (internship, score, components) in enumerate(matches):
                match_result = MatchResult(
                    internship_id=f"{internship.title.lower().replace(' ', '_')}_{i}",
                    title=internship.title,
                    company=getattr(internship, 'company_name', 'Unknown'),
                    sector=internship.sector,
                    location=internship.location,
                    duration=internship.duration,
                    skills_required=internship.skills_required,
                    application_link=internship.link,
                    overall_score=round(score, 3),
                    component_scores={k: round(v, 3) for k, v in components.items()},
                    match_explanation=self._generate_match_explanation(internship, score, components),
                    remote_available=internship.remote_available
                )
                match_results.append(asdict(match_result))
            
            response_data = {
                'recommendations': match_results,
                'total_count': len(match_results),
                'user_profile_summary': {
                    'name': profile.full_name,
                    'skills': profile.skills,
                    'preferred_sectors': profile.preferred_sectors,
                    'preferred_location': profile.preferred_location
                }
            }
            
            if extracted_prefs_dict:
                response_data['extracted_preferences'] = extracted_prefs_dict
            
            return APIResponse(
                success=True,
                data=response_data,
                message=f"Found {len(match_results)} recommendations"
            )
            
        except Exception as e:
            self.logger.error(f"Error generating recommendations: {e}")
            return APIResponse(
                success=False,
                message="Error generating recommendations",
                error_code="RECOMMENDATION_ERROR"
            )
    
    def _generate_match_explanation(self, internship: Internship, score: float, components: Dict[str, float]) -> str:
        """Generate human-readable explanation for the match"""
        explanations = []
        
        # Skill match explanation
        if components.get('skills', 0) > 0.7:
            explanations.append("Strong skill alignment")
        elif components.get('skills', 0) > 0.4:
            explanations.append("Good skill match")
        
        # Sector match
        if components.get('sector', 0) > 0.8:
            explanations.append("Perfect sector fit")
        elif components.get('sector', 0) > 0.5:
            explanations.append("Good sector alignment")
        
        # Location match
        if components.get('location', 0) > 0.8:
            explanations.append("Excellent location match")
        elif components.get('location', 0) > 0.5:
            explanations.append("Good location fit")
        
        # Remote work
        if internship.remote_available and components.get('location', 0) > 0.8:
            explanations.append("Remote work available")
        
        # Duration match
        if components.get('duration', 0) > 0.7:
            explanations.append("Duration aligns with preferences")
        
        # Company type
        if components.get('company_type', 0) > 0.8:
            explanations.append("Preferred company type")
        
        # Diversity bonuses
        if components.get('diversity_bonus', 0) > 0.1:
            explanations.append("Diversity inclusion benefits")
        
        # Company reputation
        if components.get('company_reputation', 0) > 0.8:
            explanations.append("High company reputation")
        
        if not explanations:
            explanations.append("Basic compatibility match")
        
        return "; ".join(explanations)
    
    def process_natural_language_query(self, query: str) -> APIResponse:
        """
        Process natural language query to extract preferences
        Useful for showing users what was understood from their input
        """
        try:
            extracted = self.matching_engine.preference_processor.process_natural_language_preferences(query)
            
            return APIResponse(
                success=True,
                data=asdict(extracted),
                message="Successfully processed natural language input"
            )
            
        except Exception as e:
            self.logger.error(f"Error processing natural language query: {e}")
            return APIResponse(
                success=False,
                message="Error processing natural language input",
                error_code="NLP_ERROR"
            )
    
    def get_user_profile(self, user_identifier: Union[int, str]) -> APIResponse:
        """
        Get user profile by ID or email
        
        Args:
            user_identifier: User ID (int) or email (str)
            
        Returns:
            APIResponse with user profile data
        """
        try:
            if isinstance(user_identifier, int):
                profile = self.db.get_user_profile_by_id(user_identifier)
            else:
                profile = self.db.get_user_profile_by_email(user_identifier)
            
            if not profile:
                return APIResponse(
                    success=False,
                    message="User not found",
                    error_code="USER_NOT_FOUND"
                )
            
            profile_data = asdict(profile)
            return APIResponse(
                success=True,
                data=profile_data,
                message="User profile retrieved successfully"
            )
            
        except Exception as e:
            self.logger.error(f"Error getting user profile: {e}")
            return APIResponse(
                success=False,
                message="Error retrieving user profile",
                error_code="PROFILE_ERROR"
            )
    
    def update_user_preferences(self, 
                              user_identifier: Union[int, str], 
                              preferences: Dict[str, Any],
                              natural_language_input: str = None) -> APIResponse:
        """
        Update user preferences
        
        Args:
            user_identifier: User ID (int) or email (str)
            preferences: Dictionary of preferences to update
            natural_language_input: Optional natural language to merge with preferences
            
        Returns:
            APIResponse confirming update
        """
        try:
            # Get user email for database operations
            if isinstance(user_identifier, int):
                profile = self.db.get_user_profile_by_id(user_identifier)
                if not profile:
                    return APIResponse(
                        success=False,
                        message="User not found",
                        error_code="USER_NOT_FOUND"
                    )
                email = profile.email
            else:
                email = user_identifier
            
            # Process natural language input if provided
            if natural_language_input:
                extracted = self.matching_engine.preference_processor.process_natural_language_preferences(
                    natural_language_input
                )
                
                # Merge with existing preferences
                if extracted.preferred_sectors:
                    preferences['preferred_sectors'] = extracted.preferred_sectors
                if extracted.preferred_location:
                    preferences['preferred_location'] = extracted.preferred_location
                if extracted.preferred_duration:
                    preferences['preferred_duration'] = extracted.preferred_duration
                if extracted.preferred_company_type:
                    preferences['preferred_company_type'] = extracted.preferred_company_type
            
            # Update in database
            success = self.db.update_user_preferences(email, preferences)
            
            if success:
                return APIResponse(
                    success=True,
                    data=preferences,
                    message="User preferences updated successfully"
                )
            else:
                return APIResponse(
                    success=False,
                    message="Failed to update user preferences",
                    error_code="UPDATE_ERROR"
                )
                
        except Exception as e:
            self.logger.error(f"Error updating user preferences: {e}")
            return APIResponse(
                success=False,
                message="Error updating user preferences",
                error_code="UPDATE_ERROR"
            )
    
    def get_internships_by_criteria(self, 
                                   sector: str = None,
                                   location: str = None,
                                   duration: str = None,
                                   remote_only: bool = False,
                                   limit: int = 50) -> APIResponse:
        """
        Get internships filtered by specific criteria
        
        Args:
            sector: Filter by sector
            location: Filter by location
            duration: Filter by duration
            remote_only: Only remote internships
            limit: Maximum number of results
            
        Returns:
            APIResponse with filtered internships
        """
        try:
            # Get base internships
            if sector:
                internships = self.db.get_internships_by_sector(sector)
            else:
                internships = self.db.get_active_internships(limit=limit)
            
            # Apply additional filters
            filtered_internships = []
            for internship in internships:
                # Location filter
                if location and location.lower() not in internship.location.lower():
                    continue
                
                # Duration filter
                if duration and duration.lower() not in internship.duration.lower():
                    continue
                
                # Remote filter
                if remote_only and not internship.remote_available:
                    continue
                
                filtered_internships.append(internship)
            
            # Convert to API format
            internship_data = []
            for i, internship in enumerate(filtered_internships):
                internship_data.append({
                    'internship_id': f"{internship.title.lower().replace(' ', '_')}_{i}",
                    'title': internship.title,
                    'sector': internship.sector,
                    'location': internship.location,
                    'duration': internship.duration,
                    'company_type': internship.company_type,
                    'skills_required': internship.skills_required,
                    'application_link': internship.link,
                    'capacity': internship.capacity,
                    'remote_available': internship.remote_available
                })
            
            return APIResponse(
                success=True,
                data={
                    'internships': internship_data,
                    'total_count': len(internship_data),
                    'filters_applied': {
                        'sector': sector,
                        'location': location,
                        'duration': duration,
                        'remote_only': remote_only
                    }
                },
                message=f"Found {len(internship_data)} internships matching criteria"
            )
            
        except Exception as e:
            self.logger.error(f"Error filtering internships: {e}")
            return APIResponse(
                success=False,
                message="Error filtering internships",
                error_code="FILTER_ERROR"
            )
    
    def get_matching_stats(self, user_identifier: Union[int, str]) -> APIResponse:
        """
        Get matching statistics and insights for a user
        
        Args:
            user_identifier: User ID (int) or email (str)
            
        Returns:
            APIResponse with matching statistics
        """
        try:
            # Get user profile
            if isinstance(user_identifier, int):
                profile = self.db.get_user_profile_by_id(user_identifier)
            else:
                profile = self.db.get_user_profile_by_email(user_identifier)
            
            if not profile:
                return APIResponse(
                    success=False,
                    message="User not found",
                    error_code="USER_NOT_FOUND"
                )
            
            # Get all internships for analysis
            all_internships = self.db.get_active_internships()
            
            if not all_internships:
                return APIResponse(
                    success=True,
                    data={'total_internships': 0},
                    message="No internships available for analysis"
                )
            
            # Analyze matches
            matches = self.matching_engine.rank_internships_enhanced(profile, all_internships, len(all_internships))
            
            # Calculate statistics
            scores = [match[1] for match in matches]
            high_matches = sum(1 for score in scores if score >= 0.7)
            medium_matches = sum(1 for score in scores if 0.4 <= score < 0.7)
            low_matches = sum(1 for score in scores if score < 0.4)
            
            # Sector distribution
            sector_matches = {}
            for internship, score, _ in matches[:20]:  # Top 20 for sector analysis
                sector = internship.sector
                if sector not in sector_matches:
                    sector_matches[sector] = []
                sector_matches[sector].append(score)
            
            sector_stats = {
                sector: {
                    'count': len(scores),
                    'avg_score': sum(scores) / len(scores) if scores else 0
                }
                for sector, scores in sector_matches.items()
            }
            
            stats_data = {
                'total_internships': len(all_internships),
                'match_distribution': {
                    'high_matches': high_matches,
                    'medium_matches': medium_matches,
                    'low_matches': low_matches
                },
                'average_score': sum(scores) / len(scores) if scores else 0,
                'best_score': max(scores) if scores else 0,
                'sector_performance': sector_stats,
                'top_skills_in_demand': self._get_top_skills_in_demand(all_internships),
                'recommendations': {
                    'skill_gaps': self._identify_skill_gaps(profile, all_internships),
                    'sector_suggestions': list(sector_stats.keys())[:3]
                }
            }
            
            return APIResponse(
                success=True,
                data=stats_data,
                message="Matching statistics generated successfully"
            )
            
        except Exception as e:
            self.logger.error(f"Error generating matching stats: {e}")
            return APIResponse(
                success=False,
                message="Error generating matching statistics",
                error_code="STATS_ERROR"
            )
    
    def _get_top_skills_in_demand(self, internships: List[Internship], top_n: int = 10) -> List[Dict[str, Any]]:
        """Get most frequently required skills across internships"""
        skill_counts = {}
        
        for internship in internships:
            for skill in internship.skills_required:
                skill_counts[skill] = skill_counts.get(skill, 0) + 1
        
        sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
        
        return [
            {'skill': skill, 'demand_count': count, 'percentage': round(count/len(internships)*100, 1)}
            for skill, count in sorted_skills[:top_n]
        ]
    
    def _identify_skill_gaps(self, profile: CandidateProfile, internships: List[Internship]) -> List[str]:
        """Identify skills that would improve matching scores"""
        user_skills = set(skill.lower() for skill in profile.skills)
        
        # Count missing skills in high-scoring potential matches
        missing_skills = {}
        
        for internship in internships:
            required_skills = set(skill.lower() for skill in internship.skills_required)
            missing = required_skills - user_skills
            
            for skill in missing:
                missing_skills[skill] = missing_skills.get(skill, 0) + 1
        
        # Return top missing skills
        sorted_missing = sorted(missing_skills.items(), key=lambda x: x[1], reverse=True)
        return [skill.title() for skill, _ in sorted_missing[:5]]
    
    def health_check(self) -> APIResponse:
        """Health check endpoint for monitoring"""
        try:
            # Test database connection
            test_internships = self.db.get_active_internships(limit=1)
            
            # Test AI engine
            test_profile = CandidateProfile(
                full_name="Test User",
                education="Test",
                contact_number="",
                current_address="",
                email="test@test.com",
                linkedin="",
                experience=[],
                skills=["Python"],
                gender="",
                disability_status=False,
                veteran=False
            )
            
            test_matches = self.matching_engine.rank_internships_enhanced(test_profile, test_internships[:1], 1)
            
            return APIResponse(
                success=True,
                data={
                    'database_status': 'connected',
                    'ai_engine_status': 'operational',
                    'total_active_internships': len(test_internships)
                },
                message="AI Matching Engine is healthy"
            )
            
        except Exception as e:
            self.logger.error(f"Health check failed: {e}")
            return APIResponse(
                success=False,
                message="Health check failed",
                error_code="HEALTH_CHECK_ERROR"
            )


# Flask/FastAPI integration examples
def create_flask_routes(api_instance: AIMatchingAPI):
    """
    Example Flask routes for easy backend integration
    Backend developers can use these as templates
    """
    from flask import Flask, request, jsonify
    
    app = Flask(__name__)
    
    @app.route('/api/ai/recommendations/<int:user_id>', methods=['GET'])
    def get_recommendations(user_id):
        natural_input = request.args.get('query', '')
        top_n = int(request.args.get('top_n', 10))
        sector = request.args.get('sector', None)
        
        result = api_instance.get_recommendations_by_user_id(user_id, natural_input, top_n, sector)
        return jsonify(asdict(result))
    
    @app.route('/api/ai/process-query', methods=['POST'])
    def process_query():
        data = request.json
        query = data.get('query', '')
        
        result = api_instance.process_natural_language_query(query)
        return jsonify(asdict(result))
    
    @app.route('/api/ai/profile/<int:user_id>', methods=['GET'])
    def get_profile(user_id):
        result = api_instance.get_user_profile(user_id)
        return jsonify(asdict(result))
    
    @app.route('/api/ai/internships', methods=['GET'])
    def get_internships():
        sector = request.args.get('sector')
        location = request.args.get('location')
        remote_only = request.args.get('remote_only', 'false').lower() == 'true'
        limit = int(request.args.get('limit', 50))
        
        result = api_instance.get_internships_by_criteria(sector, location, None, remote_only, limit)
        return jsonify(asdict(result))
    
    @app.route('/api/ai/stats/<int:user_id>', methods=['GET'])
    def get_stats(user_id):
        result = api_instance.get_matching_stats(user_id)
        return jsonify(asdict(result))
    
    @app.route('/api/ai/health', methods=['GET'])
    def health_check():
        result = api_instance.health_check()
        return jsonify(asdict(result))
    
    return app


# Usage examples for backend developers
def usage_examples():
    """
    Example usage patterns for backend developers
    """
    print("=== AI MATCHING ENGINE - BACKEND INTEGRATION EXAMPLES ===\n")
    
    # Initialize API
    api = AIMatchingAPI()
    
    print("1. Get recommendations for user:")
    result = api.get_recommendations_by_user_id(
        user_id=1,
        natural_language_input="I want a remote Python internship for 6 months",
        top_n=5
    )
    print(f"   Success: {result.success}")
    print(f"   Message: {result.message}")
    if result.success:
        print(f"   Found {len(result.data['recommendations'])} recommendations")
    
    print("\n2. Process natural language query:")
    nlp_result = api.process_natural_language_query(
        "Looking for a tech startup internship in Bangalore with Python and ML"
    )
    print(f"   Extracted: {nlp_result.data}")
    
    print("\n3. Get user matching statistics:")
    stats_result = api.get_matching_stats(1)
    if stats_result.success:
        print(f"   Total internships: {stats_result.data['total_internships']}")
        print(f"   High matches: {stats_result.data['match_distribution']['high_matches']}")
        print(f"   Average score: {stats_result.data['average_score']:.3f}")
    
    print("\n4. Health check:")
    health = api.health_check()
    print(f"   System status: {health.message}")
    
    print("\n=== INTEGRATION READY! ===")


if __name__ == "__main__":
    usage_examples()
