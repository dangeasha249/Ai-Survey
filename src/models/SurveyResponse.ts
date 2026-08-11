import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISurveyResponse extends Document {
  responseId: string;
  course: string;
  usesAI: string;
  primaryTool: string;
  impactRating: number;
  
  // Detailed Section Answers
  studentProfile?: {
    ageGroup?: string;
    gender?: string;
    course?: string;
    yearOfStudy?: string;
    institutionType?: string;
    residenceArea?: string;
    taluka?: string;
    collegeName?: string;
  };

  awareness?: Record<string, number>;
  aiUsage?: {
    toolsUsed?: string[];
    frequency?: string;
    duration?: string;
    purposes?: string[];
    dailyTimeSpent?: string;
  };

  learningImpact?: Record<string, number>;
  teachingImpact?: Record<string, number>;
  benefits?: Record<string, number>;
  challenges?: Record<string, number>;
  perception?: Record<string, number>;

  overallRating?: {
    rating?: number;
    confidence?: string;
  };

  openFeedback?: {
    helpText?: string;
    problemText?: string;
    suggestionsText?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const SurveyResponseSchema: Schema = new Schema(
  {
    responseId: { type: String, required: true, unique: true },
    course: { type: String, required: true },
    usesAI: { type: String, required: true, default: "Yes" },
    primaryTool: { type: String, required: true, default: "ChatGPT" },
    impactRating: { type: Number, required: true, default: 4 },

    studentProfile: {
      ageGroup: String,
      gender: String,
      course: String,
      yearOfStudy: String,
      institutionType: String,
      residenceArea: String,
      taluka: String,
      collegeName: String,
    },

    awareness: { type: Map, of: Number },
    aiUsage: {
      toolsUsed: [String],
      frequency: String,
      duration: String,
      purposes: [String],
      dailyTimeSpent: String,
    },

    learningImpact: { type: Map, of: Number },
    teachingImpact: { type: Map, of: Number },
    benefits: { type: Map, of: Number },
    challenges: { type: Map, of: Number },
    perception: { type: Map, of: Number },

    overallRating: {
      rating: Number,
      confidence: String,
    },

    openFeedback: {
      helpText: String,
      problemText: String,
      suggestionsText: String,
    },
    surveyAnswers: Schema.Types.Mixed,
  },
  { timestamps: true, strict: false }
);

const SurveyResponseModel: Model<ISurveyResponse> =
  mongoose.models.SurveyResponse ||
  mongoose.model<ISurveyResponse>("SurveyResponse", SurveyResponseSchema);

export default SurveyResponseModel;
