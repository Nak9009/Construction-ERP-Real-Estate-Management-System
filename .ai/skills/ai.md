# AI Skill

## Module Overview
The AI (Artificial Intelligence) module integrates advanced machine learning capabilities into the ERP. It handles predictive analytics, image recognition for site inspections, and natural language processing for customer support.

## Responsibilities
- Predict construction delays based on weather forecasts and past timelines.
- Analyze drone imagery or inspection photos for defects (Computer Vision).
- Provide an NLP chatbot for internal knowledge retrieval or customer queries.

## Business Rules
- AI predictions must always be presented as "Estimates" or "Suggestions", never overwriting human-entered financial or contractual data without explicit approval.
- Any images processed for Computer Vision must comply with local privacy laws regarding faces/license plates.

## User Roles & Permissions
- **All Users**: Consume AI insights on their respective dashboards.
- **Admin**: Configure AI model parameters or API keys.

## Database Entities
- `ai_predictions`
  - `id` (UUID)
  - `entity_type` (String, e.g., 'project', 'house')
  - `entity_id` (UUID)
  - `prediction_type` (String, e.g., 'delay_risk')
  - `confidence_score` (Decimal)
  - `data` (JSON)

## APIs
- `POST /api/v1/ai/analyze-image`
- `GET /api/v1/ai/predictions/{entity_type}/{id}`

## UI Pages
- Insights are typically embedded into existing views (e.g., a "Risk Prediction" Card on the Project Dashboard).

## shadcn/ui Components to Use
- `Alert`: To highlight high-risk AI predictions.
- `Progress`: To show the confidence score of a prediction.
- `Tooltip`: To explain how the AI arrived at a specific suggestion.

## Backend Architecture
- The Laravel backend acts merely as an API Gateway for AI tasks. Heavy lifting is delegated to dedicated Python Microservices (FastAPI) running PyTorch/OpenCV.
- Communication between Laravel and the Python microservice happens asynchronously via RabbitMQ or synchronously via internal HTTP requests, depending on the required response time.

## Frontend Architecture
- Chat interfaces (if applicable) should use optimistic UI updates to feel responsive while waiting for the LLM/AI backend to stream the response.

## Testing Requirements
- Integration Tests: Mock the Python FastAPI responses to ensure the Laravel backend handles slow AI responses or timeout errors gracefully.
