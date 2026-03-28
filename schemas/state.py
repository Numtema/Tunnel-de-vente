from __future__ import annotations
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class IntentModel(BaseModel):
    primary_intent: Optional[str] = None
    declared_goal: Optional[str] = None

class AnalysisModel(BaseModel):
    normalized_request: Optional[str] = None
    repaired_request: Optional[str] = None
    missing_fields: List[str] = Field(default_factory=list)
    intent: IntentModel = Field(default_factory=IntentModel)

class FunnelProjectState(BaseModel):
    raw_request: str = ""
    analysis: AnalysisModel = Field(default_factory=AnalysisModel)
    planning_brief: Dict[str, Any] = Field(default_factory=dict)
    task_graph: List[Dict[str, Any]] = Field(default_factory=list)
    agent_registry: Dict[str, str] = Field(default_factory=dict)
    agent_outputs: Dict[str, Any] = Field(default_factory=dict)
    final_output: Dict[str, Any] = Field(default_factory=dict)
    confidence_score: float = 0.0
