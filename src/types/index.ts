export interface Question {
	id: number;
	question: string;
	answer: string;
}

export interface TestForm {
	title: string;
	date: string;
	name: string;
	questions: Question[];
}

export type QuestionSelectionMode = 'all' | 'range' | 'specific';

export interface QuestionSelection {
	mode: QuestionSelectionMode;
	range?: {
		from: number;
		to: number;
	};
	specific?: number[];
}

export interface PrintSettings {
	linesPerAnswer: number;
	separateAnswerPage: boolean;
	showAnswers: boolean;
	printMode: 'study' | 'test'; // 'study' = سؤال وإجابة معاً، 'test' = أسئلة منفصلة عن إجابات
	questionSelection: QuestionSelection;
}
