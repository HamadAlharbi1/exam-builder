'use client';

import { PrintSettings, Question } from '@/types';

interface PrintableTestProps {
	questions: Question[];
	settings: PrintSettings;
	testInfo: {
		title: string;
		date: string;
		name: string;
	};
}

export default function PrintableTest({ questions, settings, testInfo }: PrintableTestProps) {
	const today = new Date().toLocaleDateString('ar-SA');

	// دالة للتحقق من وجود ترقيم في السؤال
	const hasNumbering = (text: string) => /^\d+\.\s*/.test(text.trim());

	// دالة لعرض السؤال مع أو بدون ترقيم
	const renderQuestion = (question: string, index: number) => {
		const questionText = question.trim();
		if (hasNumbering(questionText)) {
			return <strong>{questionText}</strong>;
		} else {
			return (
				<strong>
					س{index + 1}: {questionText}
				</strong>
			);
		}
	};

	// دالة لفلترة الأسئلة حسب الاختيار
	const getFilteredQuestions = () => {
		const { mode, range, specific } = settings.questionSelection;

		if (mode === 'all') {
			return questions;
		}

		if (mode === 'range' && range) {
			return questions.slice(range.from - 1, range.to);
		}

		if (mode === 'specific' && specific) {
			return questions.filter((_, index) => specific.includes(index + 1));
		}

		return questions;
	};

	const filteredQuestions = getFilteredQuestions();

	// نموذج الدراسة - السؤال والإجابة معاً
	const renderStudyMode = () => (
		<div className='study-mode'>
			<div className='header'>
				<h1>{testInfo.title || 'نموذج الدراسة'}</h1>
				<div className='test-info'>
					<p>التاريخ: {testInfo.date || today}</p>
					<p>الاسم: {testInfo.name || '________________'}</p>
					{settings.questionSelection.mode !== 'all' && (
						<p className='text-sm text-gray-600'>
							الأسئلة المختارة: {filteredQuestions.length} من {questions.length}
						</p>
					)}
				</div>
			</div>

			<div className='questions-section'>
				{filteredQuestions.map((question, index) => (
					<div key={question.id} className='question-container study-question'>
						<div className='question'>{renderQuestion(question.question, index)}</div>
						<div className='answer'>
							<strong>الإجابة:</strong> {question.answer}
						</div>
					</div>
				))}
			</div>
		</div>
	);

	// نموذج الاختبار - أسئلة منفصلة عن إجابات
	const renderTestMode = () => (
		<>
			{/* صفحة الأسئلة */}
			<div className='questions-page'>
				<div className='header'>
					<h1>{testInfo.title || 'ورقة اختبار ذاتي'}</h1>
					<div className='test-info'>
						<p>التاريخ: {testInfo.date || today}</p>
						<p>الاسم: {testInfo.name || '________________'}</p>
						{settings.questionSelection.mode !== 'all' && (
							<p className='text-sm text-gray-600'>
								الأسئلة المختارة: {filteredQuestions.length} من {questions.length}
							</p>
						)}
					</div>
				</div>

				<div className='questions-section'>
					{filteredQuestions.map((question, index) => (
						<div key={question.id} className='question-container'>
							<div className='question'>{renderQuestion(question.question, index)}</div>
							<div className='answer-lines'>
								{Array.from({ length: settings.linesPerAnswer }).map((_, lineIndex) => (
									<div key={lineIndex} className='answer-line'></div>
								))}
							</div>
						</div>
					))}
				</div>

				<div className='evaluation-section'>
					<h3>جدول التقييم الذاتي</h3>
					<table className='evaluation-table'>
						<thead>
							<tr>
								<th>رقم السؤال</th>
								<th>✓/✗</th>
								<th>ملاحظات</th>
							</tr>
						</thead>
						<tbody>
							{filteredQuestions.map((_, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>
										<span>□</span>
									</td>
									<td>________________</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className='results-summary'>
						<p>عدد الإجابات الصحيحة: _____ من {filteredQuestions.length}</p>
						<p>النسبة المئوية: _____%</p>
					</div>
				</div>
			</div>

			{/* صفحة الإجابات */}
			{settings.separateAnswerPage && (
				<div className='page-break answers-page'>
					<div className='header'>
						<h1>الإجابات النموذجية</h1>
						<p>التاريخ: {testInfo.date || today}</p>
					</div>

					<div className='answers-section'>
						{filteredQuestions.map((question, index) => (
							<div key={question.id} className='answer-item'>
								<strong>{index + 1}.</strong> {question.answer}
							</div>
						))}
					</div>
				</div>
			)}

			{/* الإجابات في نفس الصفحة (مقلوبة) */}
			{!settings.separateAnswerPage && settings.showAnswers && (
				<div className='answers-section'>
					<h3>الإجابات النموذجية (مقلوبة)</h3>
					<div style={{ transform: 'rotate(180deg)' }}>
						{filteredQuestions.map((question, index) => (
							<div key={question.id} className='answer-item'>
								<strong>{index + 1}.</strong> {question.answer}
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);

	return (
		<div className='print-container'>
			{/* إعدادات الطباعة */}
			<style jsx global>{`
				@media print {
					body {
						direction: rtl;
						font-family: 'Arial', sans-serif;
						margin: 0;
						padding: 2cm;
						font-size: 12pt;
						line-height: 1.5;
					}

					.no-print {
						display: none !important;
					}

					.page-break {
						page-break-before: always;
					}

					.answer-line {
						border-bottom: 1px dotted #000;
						height: 1.5em;
						margin: 0.2em 0;
					}

					.question-container {
						margin-bottom: 1.5em;
						page-break-inside: avoid;
					}

					.study-question {
						border: 1px solid #000;
						padding: 1em;
						margin-bottom: 1em;
						border-radius: 0.5em;
					}

					.study-question .question {
						margin-bottom: 0.5em;
						font-weight: bold;
					}

					.study-question .answer {
						background-color: #f9f9f9;
						padding: 0.5em;
						border-right: 3px solid #007bff;
					}

					.evaluation-table {
						width: 100%;
						border-collapse: collapse;
						margin: 2em 0;
					}

					.evaluation-table th,
					.evaluation-table td {
						border: 1px solid #000;
						padding: 0.5em;
						text-align: center;
					}

					.header {
						text-align: center;
						margin-bottom: 2em;
						border-bottom: 2px solid #000;
						padding-bottom: 1em;
					}

					.answers-section {
						margin-top: 2em;
					}

					.answer-item {
						margin-bottom: 0.5em;
						padding: 0.2em 0;
					}

					.results-summary {
						margin-top: 1em;
						text-align: center;
					}

					.results-summary p {
						margin: 0.5em 0;
					}
				}
			`}</style>

			{/* عرض النموذج المناسب */}
			{settings.printMode === 'study' ? renderStudyMode() : renderTestMode()}
		</div>
	);
}
