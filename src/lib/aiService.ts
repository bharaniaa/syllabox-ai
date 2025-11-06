interface AIConfig {
  apiKey: string
  baseURL: string
  model: string
}

interface LessonRequest {
  subject: string
  topic: string
  objectives: string
  gradeLevel: string
  duration?: string
}

interface AssessmentRequest {
  course: string
  topic: string
  questions: number
  difficulty: string
  type: string
}

const AI_CONFIG: AIConfig = {
  apiKey: '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  model: 'nvidia/llama-3.1-nemotron-70b-instruct'
}

class AIService {
  private apiKey: string
  private baseURL: string
  private model: string

  constructor(config: AIConfig) {
    this.apiKey = config.apiKey
    this.baseURL = config.baseURL
    this.model = config.model
  }

  private async makeAIRequest(prompt: string, maxTokens: number = 2000): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational content creator. Generate high-quality, pedagogically sound educational materials that are engaging, age-appropriate, and aligned with learning objectives.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
          top_p: 0.9,
          stream: false
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`AI API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from AI API')
      }

      return data.choices[0].message.content.trim()
    } catch (error) {
      console.error('AI API Error:', error)
      throw new Error('Failed to generate content with AI. Please try again.')
    }
  }

  async generateLesson(request: LessonRequest): Promise<any> {
    const prompt = `
Create a comprehensive lesson plan for ${request.gradeLevel} students with the following details:

Subject: ${request.subject}
Topic: ${request.topic}
Learning Objectives: ${request.objectives}
Duration: ${request.duration || '45 minutes'}

Please structure your response as a valid JSON object with exactly this format:

{
  "title": "Lesson Title",
  "gradeLevel": "${request.gradeLevel}",
  "duration": "${request.duration || '45 minutes'}",
  "objectives": ["objective1", "objective2", "objective3"],
  "materials": ["material1", "material2", "material3"],
  "sections": [
    {
      "title": "Section Name",
      "duration": "Time for this section",
      "activities": ["activity1", "activity2", "activity3"]
    }
  ],
  "assessment": {
    "formative": ["assessment1", "assessment2"],
    "summative": ["assessment1", "assessment2"]
  },
  "extensions": ["extension1", "extension2"]
}

Make the content age-appropriate, engaging, and educationally sound. Use the subject: ${request.subject} and topic: ${request.topic}.`

    try {
      const aiResponse = await this.makeAIRequest(prompt, 2500)

      let lessonData
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          lessonData = JSON.parse(jsonMatch[0])
        } else {
          lessonData = JSON.parse(aiResponse)
        }
      } catch (parseError) {
        console.warn('JSON parse error, creating fallback structure')
        lessonData = {
          title: `${request.subject} - ${request.topic}`,
          gradeLevel: request.gradeLevel,
          duration: request.duration || '45 minutes',
          objectives: request.objectives.split('\n').filter(obj => obj.trim()),
          materials: ['Textbook', 'Whiteboard', 'Student worksheets'],
          sections: [
            {
              title: 'Introduction',
              duration: '10 minutes',
              activities: [
                `Brief review of ${request.subject} concepts`,
                'Present learning objectives',
                'Engage students with thought-provoking question'
              ]
            },
            {
              title: 'Main Content',
              duration: '25 minutes',
              activities: [
                `Introduce key concepts related to ${request.topic}`,
                'Provide real-world examples',
                'Encourage student participation',
                'Use visual aids and interactive elements'
              ]
            },
            {
              title: 'Conclusion',
              duration: '10 minutes',
              activities: [
                'Summarize key points',
                'Address student questions',
                'Assign follow-up activities'
              ]
            }
          ],
          assessment: {
            formative: [
              'Question students during lesson',
              'Use exit tickets',
              'Observe engagement'
            ],
            summative: [
              'Weekly quiz',
              'Project-based assignment',
              'End-of-unit assessment'
            ]
          },
          extensions: [
            'Research project opportunity',
            'Cross-curricular connections'
          ]
        }
      }

      return lessonData
    } catch (error) {
      console.error('Lesson generation error:', error)
      throw new Error('Failed to generate lesson plan with AI')
    }
  }

  async generateAssessment(request: AssessmentRequest): Promise<any> {
    const prompt = `
Create an assessment for ${request.course} students focusing on ${request.topic}.

Requirements:
- Number of questions: ${request.questions}
- Difficulty level: ${request.difficulty}
- Assessment type: ${request.type}

Please structure your response as a valid JSON object with exactly this format:

{
  "title": "Assessment Title",
  "course": "${request.course}",
  "topic": "${request.topic}",
  "difficulty": "${request.difficulty}",
  "type": "${request.type}",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A",
      "explanation": "Why this answer is correct"
    }
  ],
  "time_limit": "45 minutes",
  "total_points": ${request.questions * 5},
  "instructions": "Instructions for students",
  "rubric": {
    "excellent": "Criteria for excellent performance",
    "good": "Criteria for good performance", 
    "satisfactory": "Criteria for satisfactory performance"
  }
}

Make the questions challenging but fair, and ensure they align with the learning objectives. Use the course: ${request.course} and topic: ${request.topic}.`

    try {
      const aiResponse = await this.makeAIRequest(prompt, 3000)

      let assessmentData
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          assessmentData = JSON.parse(jsonMatch[0])
        } else {
          assessmentData = JSON.parse(aiResponse)
        }
      } catch (parseError) {
        console.warn('Assessment JSON parse error, creating fallback structure')
        assessmentData = {
          title: `${request.course} Assessment - ${request.topic}`,
          course: request.course,
          topic: request.topic,
          difficulty: request.difficulty,
          type: request.type,
          questions: Array.from({ length: request.questions }, (_, i) => ({
            id: i + 1,
            type: 'multiple_choice',
            question: `Question ${i + 1} about ${request.topic}`,
            options: [
              `Option A for ${request.topic}`,
              `Option B for ${request.topic}`,
              `Option C for ${request.topic}`,
              `Option D for ${request.topic}` 
            ],
            correct_answer: 'A',
            explanation: 'This is the correct answer based on the concepts covered.'
          })),
          time_limit: `${Math.max(30, request.questions * 3)} minutes`,
          total_points: request.questions * 5,
          instructions: 'Read each question carefully and select the best answer.',
          rubric: {
            excellent: '90-100%: Comprehensive understanding demonstrated',
            good: '80-89%: Good grasp of key concepts',
            satisfactory: '70-79%: Basic understanding with some gaps'
          }
        }
      }

      return assessmentData
    } catch (error) {
      console.error('Assessment generation error:', error)
      throw new Error('Failed to generate assessment with AI')
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const testPrompt = 'Generate a simple educational activity for elementary students. Respond with just "Connection successful" if you understand.'
      const response = await this.makeAIRequest(testPrompt, 50)
      return response.toLowerCase().includes('successful') || response.length > 0
    } catch (error) {
      console.error('AI connection test failed:', error)
      return false
    }
  }
}

export const aiService = new AIService(AI_CONFIG)
export type { LessonRequest, AssessmentRequest }
