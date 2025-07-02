'use client';

import FileUpload from '@/components/FileUpload';
import PrintableTest from '@/components/PrintableTest';
import PrintSettingsComponent from '@/components/PrintSettings';
import TestInfoForm from '@/components/TestInfoForm';
import { PrintSettings, Question } from '@/types';
import { useState } from 'react';

export default function Home() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [settings, setSettings] = useState<PrintSettings>({
		linesPerAnswer: 3,
		separateAnswerPage: true,
		showAnswers: false,
		printMode: 'test',
		questionSelection: {
			mode: 'all',
		},
	});
	const [testInfo, setTestInfo] = useState({
		title: '',
		date: new Date().toISOString().split('T')[0],
		name: '',
	});

	const handlePrint = () => {
		window.print();
	};

	return (
		<div className='min-h-screen bg-gray-50' dir='rtl'>
			{/* Header */}
			<header className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center py-6'>
						{questions.length > 0 && (
							<button
								onClick={handlePrint}
								className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors no-print'
							>
								🖨️ طباعة النموذج
							</button>
						)}
					</div>
				</div>
			</header>

			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Sidebar - Controls */}
					<div className='lg:col-span-1 space-y-6 no-print'>
						{/* File Upload */}
						<FileUpload onQuestionsParsed={setQuestions} />

						{/* Test Info Form */}
						<TestInfoForm testInfo={testInfo} onTestInfoChange={setTestInfo} />

						{/* Print Settings */}
						<PrintSettingsComponent
							settings={settings}
							onSettingsChange={setSettings}
							totalQuestions={questions.length}
						/>

						{/* Questions Preview */}
						{questions.length > 0 && (
							<div className='bg-white p-6 rounded-lg shadow-md'>
								<h3 className='text-lg font-semibold mb-4 text-right'>
									معاينة الأسئلة ({questions.length} سؤال)
								</h3>
								<div className='space-y-2 max-h-60 overflow-y-auto'>
									{questions.map((question, index) => (
										<div key={question.id} className='text-sm text-gray-600 border-b pb-2'>
											<strong>س{index + 1}:</strong> {question.question}
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Main Content - Printable Preview */}
					<div className='lg:col-span-2'>
						{questions.length > 0 ? (
							<div className='bg-white shadow-lg rounded-lg overflow-hidden'>
								<div className='p-8'>
									<PrintableTest questions={questions} settings={settings} testInfo={testInfo} />
								</div>
							</div>
						) : (
							<div className='bg-white p-12 rounded-lg shadow-md text-center'>
								<div className='text-6xl mb-4'>📝</div>
								<h2 className='text-2xl font-semibold mb-2'>
									مرحباً بك في مولد الاختبار الذاتي القابل للطباعة
								</h2>
								<p className='text-gray-600 mb-6'>
									ارفع ملف qa.md لبدء إنشاء نموذج الاختبار القابل للطباعة
								</p>
								<div className='text-sm text-gray-500'>
									<p>تنسيق الملف المطلوب:</p>
									<pre className='bg-gray-100 p-4 rounded mt-2 text-right'>
										{`ما هو الاختبار الذاتي؟
الإجابة: طريقة للتحقق من فهمك للمادة الدراسية من خلال أسئلة وإجابات

ما هي مميزات الاختبار الذاتي؟
الإجابة: يساعد على تثبيت المعلومات واكتشاف نقاط الضعف`}
									</pre>
								</div>
							</div>
						)}
					</div>
				</div>
			</main>

			{/* Print Styles */}
			<style jsx global>{`
				@media print {
					body {
						direction: rtl;
						font-family: 'Arial', sans-serif;
						margin: 0;
						padding: 0;
						background: white;
					}

					.no-print {
						display: none !important;
					}

					.print-container {
						margin: 0;
						padding: 0;
					}

					.questions-page,
					.answers-page {
						page-break-after: always;
					}

					.page-break {
						page-break-before: always;
					}
				}
			`}</style>
		</div>
	);
}
