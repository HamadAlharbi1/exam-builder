import { Question } from '@/types';

export function parseQAMarkdown(content: string): Question[] {
	const lines = content.split('\n').filter((line) => line.trim());
	const questions: Question[] = [];
	let currentQuestion = '';
	let currentAnswer = '';
	let questionId = 1;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// إذا كان السطر لا يحتوي على "الإجابة:" فهو سؤال
		if (!line.includes('الإجابة:')) {
			// إذا كان لدينا سؤال وإجابة سابقين، احفظهما
			if (currentQuestion && currentAnswer) {
				questions.push({
					id: questionId,
					question: currentQuestion.trim(),
					answer: currentAnswer.trim(),
				});
				questionId++;
				currentQuestion = '';
				currentAnswer = '';
			}
			currentQuestion = line;
		} else {
			// استخراج الإجابة من السطر
			const answerMatch = line.match(/الإجابة:\s*(.*)/);
			if (answerMatch) {
				currentAnswer = answerMatch[1];
			}
		}
	}

	// إضافة السؤال الأخير إذا كان موجوداً
	if (currentQuestion && currentAnswer) {
		questions.push({
			id: questionId,
			question: currentQuestion.trim(),
			answer: currentAnswer.trim(),
		});
	}

	return questions;
}
